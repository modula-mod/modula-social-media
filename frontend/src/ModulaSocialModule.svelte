<script lang="ts">
	import { onMount } from 'svelte';
	import {
		createComment,
		createPost,
		loadComments,
		loadExplore,
		loadFeed,
		loadModuleContract,
		loadMyProfile,
		normalizeSurfaceId,
		reactToPost,
		resolveApiBase
	} from './lib/api';
	import type {
		ModulaContext,
		SocialComment,
		SocialContractPayload,
		SocialPost,
		SocialProfileMePayload,
		Visibility
	} from './lib/types';

	export let modula: ModulaContext = {};

	const reactionTypes = [
		{ id: 'like', label: 'Like' },
		{ id: 'love', label: 'Love' },
		{ id: 'insightful', label: 'Insightful' },
		{ id: 'boost', label: 'Boost' },
		{ id: 'laugh', label: 'Laugh' }
	];

	let mounted = false;
	let loading = true;
	let error = '';
	let contract: SocialContractPayload | null = null;

	let feedPosts: SocialPost[] = [];
	let explorePosts: SocialPost[] = [];
	let trendingTopics: string[] = [];
	let profile: SocialProfileMePayload | null = null;
	let profilePosts: SocialPost[] = [];

	let commentsByPost: Record<string, SocialComment[]> = {};
	let commentDraftByPost: Record<string, string> = {};
	let commentsLoadingByPost: Record<string, boolean> = {};
	let openCommentPostId = '';
	let savedPosts: Record<string, boolean> = {};
	let copiedPostId = '';

	let composerBody = '';
	let composerVisibility: Visibility = 'public';
	let composerMode: 'post' | 'thread' | 'announcement' = 'post';
	let composerTags = '';

	let lastSurfaceKey = '';

	$: apiBase = resolveApiBase(modula);
	$: surfaceId = normalizeSurfaceId(modula);
	$: surfaceKey = `${apiBase}:${surfaceId}`;
	$: activePosts = surfaceId === 'explore' || surfaceId === 'reels' ? explorePosts : surfaceId === 'profile' ? profilePosts : feedPosts;
	$: reactionTotal = activePosts.reduce((sum, post) => sum + (post.reaction_count || 0), 0);
	$: commentTotal = activePosts.reduce((sum, post) => sum + (post.comment_count || 0), 0);
	$: moduleVersion = contract?.version || modula.version || '1.6.2';
	$: canPost = Boolean(contract?.permissions?.some((permission) => permission.id === 'social.post.create'));
	$: canReact = Boolean(contract?.permissions?.some((permission) => permission.id === 'social.post.react' || permission.id === 'social.reaction.create'));
	$: quickTags = trendingTopics.length ? trendingTopics.slice(0, 5) : ['modula', 'workspace', 'creator', 'launch'];

	$: if (mounted && surfaceKey !== lastSurfaceKey) {
		lastSurfaceKey = surfaceKey;
		void refreshSurface();
	}

	onMount(() => {
		mounted = true;
		lastSurfaceKey = surfaceKey;
		void refreshSurface();
	});

	function asDate(value: number): Date {
		return new Date(value > 1_000_000_000_000 ? value : value * 1000);
	}

	function formatTime(value: number): string {
		return asDate(value).toLocaleString();
	}

	function initials(post: SocialPost): string {
		return (post.author?.display_name || post.author?.handle || 'SM').slice(0, 2).toUpperCase();
	}

	function surfaceTitle(): string {
		if (surfaceId === 'explore') return 'Explore';
		if (surfaceId === 'profile') return 'Social Profile';
		if (surfaceId === 'reels') return 'Reels';
		return 'Social Feed';
	}

	function addSmartTag(tag: string) {
		const normalized = tag.startsWith('#') ? tag : `#${tag}`;
		if (composerBody.includes(normalized)) return;
		composerBody = `${composerBody}${composerBody.trim() ? ' ' : ''}${normalized}`;
	}

	async function refreshSurface() {
		loading = true;
		error = '';

		try {
			contract = await loadModuleContract(apiBase).catch(() => null);

			if (surfaceId === 'feed') {
				const feed = await loadFeed(apiBase, 20);
				feedPosts = feed.posts || [];
				return;
			}

			if (surfaceId === 'explore') {
				const payload = await loadExplore(apiBase, 12);
				explorePosts = payload.trending_posts || [];
				trendingTopics = payload.trending_topics || [];
				return;
			}

			if (surfaceId === 'profile') {
				profile = await loadMyProfile(apiBase);
				const feed = await loadFeed(apiBase, 50);
				profilePosts = (feed.posts || []).filter(
					(item) => item.author?.identity_id === profile?.profile?.identity_id
				);
				return;
			}

			if (surfaceId === 'reels') {
				const payload = await loadExplore(apiBase, 12);
				explorePosts = payload.trending_posts || [];
				trendingTopics = payload.trending_topics || [];
				return;
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load social surface.';
		} finally {
			loading = false;
		}
	}

	async function submitPost() {
		const body = composerBody.trim();
		if (!body) return;

		const decoratedBody = composerMode === 'post' ? body : `[${composerMode}] ${body}`;
		try {
			const created = await createPost(apiBase, decoratedBody, composerVisibility);
			if (created?.post) feedPosts = [created.post, ...feedPosts];
			composerBody = '';
			composerTags = '';
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to create post.';
		}
	}

	function updatePost(postId: string, next: SocialPost) {
		feedPosts = feedPosts.map((item) => (item.post_id === postId ? next : item));
		profilePosts = profilePosts.map((item) => (item.post_id === postId ? next : item));
		explorePosts = explorePosts.map((item) => (item.post_id === postId ? next : item));
	}

	async function submitReaction(postId: string, reactionType = 'like') {
		try {
			const mutation = await reactToPost(apiBase, postId, reactionType);
			if (mutation.post) updatePost(postId, mutation.post);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to react to post.';
		}
	}

	async function openComments(postId: string) {
		openCommentPostId = openCommentPostId === postId ? '' : postId;
		if (!openCommentPostId || commentsByPost[postId] || commentsLoadingByPost[postId]) return;

		commentsLoadingByPost = { ...commentsLoadingByPost, [postId]: true };
		try {
			const payload = await loadComments(apiBase, postId, 80);
			commentsByPost = { ...commentsByPost, [postId]: payload.comments || [] };
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load comments.';
		} finally {
			commentsLoadingByPost = { ...commentsLoadingByPost, [postId]: false };
		}
	}

	async function submitComment(postId: string) {
		const draft = (commentDraftByPost[postId] || '').trim();
		if (!draft) return;

		try {
			const mutation = await createComment(apiBase, postId, draft);
			if (mutation.comment) {
				const existing = commentsByPost[postId] || [];
				commentsByPost = { ...commentsByPost, [postId]: [...existing, mutation.comment] };
			}
			if (mutation.post) updatePost(postId, mutation.post);
			commentDraftByPost = { ...commentDraftByPost, [postId]: '' };
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to add comment.';
		}
	}

	async function sharePost(post: SocialPost) {
		const url = `${location.origin}/social?post=${encodeURIComponent(post.post_id)}`;
		try {
			await navigator.clipboard?.writeText(url);
			copiedPostId = post.post_id;
			setTimeout(() => (copiedPostId = ''), 1600);
		} catch {
			copiedPostId = post.post_id;
			setTimeout(() => (copiedPostId = ''), 1600);
		}
	}

	function toggleSaved(postId: string) {
		savedPosts = { ...savedPosts, [postId]: !savedPosts[postId] };
	}
</script>

<section class="social-module" aria-label="Social module runtime" data-advanced-social="true" data-shell-aligned="true">
	<header class="panel hero">
		<div class="hero-copy">
			<div class="eyebrow-row">
				<span class="kicker">Modula Social</span>
				<span class="pill success">social-media@{moduleVersion}</span>
				<span class="pill">Native Svelte</span>
			</div>
			<h2>{surfaceTitle()}</h2>
			<p class="muted">Identity-native social surfaces installed into the Modula shell, with backend-driven posts, reactions, comments, contracts, widgets, and notification channels.</p>
		</div>
		<nav class="tabs" aria-label="Social surfaces">
			<a href="/social" class:active={surfaceId === 'feed'}>Feed</a>
			<a href="/social/explore" class:active={surfaceId === 'explore'}>Explore</a>
			<a href="/social/profile" class:active={surfaceId === 'profile'}>Profile</a>
			<a href="/social/reels" class:active={surfaceId === 'reels'}>Reels</a>
		</nav>
		<div class="metric-grid" aria-label="Social live metrics">
			<div><span>{activePosts.length}</span><small>posts</small></div>
			<div><span>{reactionTotal}</span><small>reactions</small></div>
			<div><span>{commentTotal}</span><small>comments</small></div>
			<div><span>{contract?.widgets?.length || 0}</span><small>widgets</small></div>
		</div>
	</header>

	{#if loading}
		<div class="panel status">Loading {surfaceTitle().toLowerCase()}...</div>
	{:else if error}
		<div class="panel status error">{error}</div>
	{:else}
		<div class="content-grid">
			<main class="main-column">
				{#if surfaceId === 'feed'}
					<section class="panel composer" data-advanced-composer="true">
						<div class="section-head">
							<div class="identity-row">
								<div class="avatar self">{modula?.userContext?.name ? String(modula.userContext.name).slice(0, 2).toUpperCase() : 'ME'}</div>
								<div>
									<div class="kicker">Advanced Composer</div>
									<h3>Create a post</h3>
									<p class="muted">{canPost ? 'Posting is enabled for this identity.' : 'Posting is disabled until social.post.create is granted.'}</p>
								</div>
							</div>
							<div class="segmented">
								<button class:active={composerMode === 'post'} type="button" on:click={() => (composerMode = 'post')}>Post</button>
								<button class:active={composerMode === 'thread'} type="button" on:click={() => (composerMode = 'thread')}>Thread</button>
								<button class:active={composerMode === 'announcement'} type="button" on:click={() => (composerMode = 'announcement')}>Notice</button>
							</div>
						</div>
						<textarea bind:value={composerBody} placeholder="Share with your network, workspace, or followers..." disabled={!canPost}></textarea>
						<div class="quick-tags" aria-label="Quick tags">
							{#each quickTags as tag}
								<button type="button" on:click={() => addSmartTag(tag)}>#{tag}</button>
							{/each}
						</div>
						<div class="composer-tools">
							<select bind:value={composerVisibility} aria-label="Visibility" disabled={!canPost}>
								<option value="public">Public</option>
								<option value="followers">Followers</option>
								<option value="private">Private</option>
							</select>
							<input bind:value={composerTags} placeholder="Smart tags, e.g. #launch #team" disabled={!canPost} />
							<button type="button" on:click={() => addSmartTag(composerTags.replace(/^#/, ''))} disabled={!canPost || !composerTags.trim()}>Add tag</button>
							<button class="primary" type="button" on:click={submitPost} disabled={!canPost || !composerBody.trim()}>Publish</button>
						</div>
					</section>
				{/if}

				{#if surfaceId === 'explore' || surfaceId === 'reels'}
					<section class="panel discovery">
						<div class="section-head">
							<div>
								<div class="kicker">Discovery</div>
								<h3>{surfaceId === 'reels' ? 'Reels plugin extension' : 'Explore social activity'}</h3>
								<p class="muted">{surfaceId === 'reels' ? 'Plugin surface attached to Social Media. Shows ranked content until the full media pipeline is installed.' : 'Backend-ranked public activity, tags, and module-ready recommendations.'}</p>
							</div>
							<span class="pill success">Backend ranked</span>
						</div>
						<div class="discovery-grid">
							<div class="mini-panel">
								<div class="kicker">Trending tags</div>
								<div class="topic-list">
									{#each quickTags as topic}
										<span>#{topic}</span>
									{/each}
								</div>
							</div>
							<div class="mini-panel">
								<div class="kicker">Suggested spaces</div>
								<strong>Creators · Teams · Launches</strong>
								<p class="muted">Uses backend Explore data and safe empty states.</p>
							</div>
							<div class="mini-panel">
								<div class="kicker">Recent activity</div>
								<strong>{activePosts.length} ranked posts</strong>
								<p class="muted">No synthetic people or fake activity.</p>
							</div>
						</div>
					</section>
				{/if}

				{#if surfaceId === 'profile' && profile}
					<section class="panel profile-card">
						<div class="section-head">
							<div class="identity-row">
								<div class="avatar self">{profile.profile.display_name.slice(0, 2).toUpperCase()}</div>
								<div>
									<div class="kicker">Identity profile extension</div>
									<h3>{profile.profile.display_name}</h3>
									<p class="muted">@{profile.profile.handle} · canonical identity-owned profile</p>
								</div>
							</div>
							<span class="pill">Profile-scoped</span>
						</div>
						<div class="metric-grid compact">
							<div><span>{profile.post_count}</span><small>posts</small></div>
							<div><span>{profile.follower_count}</span><small>followers</small></div>
							<div><span>{profile.following_count}</span><small>following</small></div>
						</div>
					</section>
				{/if}

				{#if activePosts.length === 0}
					<div class="panel status">No social activity yet. Create the first post or check back after your workspace has activity.</div>
				{:else}
					<div class="stack">
						{#each activePosts as post (post.post_id)}
							<article class="panel post" data-social-post="true">
								<div class="post-head">
									<div class="avatar">{initials(post)}</div>
									<div>
										<strong>{post.author.display_name}</strong>
										<div class="muted">@{post.author.handle} · {formatTime(post.created_at)} · {post.visibility}</div>
									</div>
									<button class="ghost menu" type="button" title="Post menu">More</button>
								</div>
								<p class="post-body">{post.body}</p>
								<div class="reaction-bar" data-reaction-bar="true" aria-label="Reaction bar">
									{#each reactionTypes as reaction}
										<button
											type="button"
											class:active={post.viewer_reaction === reaction.id}
											on:click={() => submitReaction(post.post_id, reaction.id)}
											disabled={!canReact}
											title={canReact ? `${reaction.label} reaction` : 'Reaction permission missing'}
										>
											<span>{reaction.label}</span>
											<strong>{post.reactions_by_type?.[reaction.id] || 0}</strong>
										</button>
									{/each}
								</div>
								<div class="post-actions">
									<button type="button" on:click={() => openComments(post.post_id)}>
										Comments · {post.comment_count}
									</button>
									<button type="button" on:click={() => sharePost(post)}>{copiedPostId === post.post_id ? 'Copied link' : 'Share'}</button>
									<button type="button" on:click={() => toggleSaved(post.post_id)}>{savedPosts[post.post_id] ? 'Saved' : 'Bookmark'}</button>
								</div>

								{#if openCommentPostId === post.post_id}
									<div class="comments" data-comment-panel="true">
										<div class="section-head tight">
											<strong>Comments panel</strong>
											<span class="muted">{commentsLoadingByPost[post.post_id] ? 'Loading...' : `${commentsByPost[post.post_id]?.length || 0} loaded`}</span>
										</div>
										{#if (commentsByPost[post.post_id] || []).length === 0}
											<div class="muted">No comments yet.</div>
										{:else}
											{#each commentsByPost[post.post_id] as comment (comment.comment_id)}
												<div class="comment">
													<strong>{comment.author.display_name}</strong>
													<span class="muted"> · {formatTime(comment.created_at)}</span>
													<p>{comment.body}</p>
												</div>
											{/each}
										{/if}
										<div class="comment-compose">
											<input
												value={commentDraftByPost[post.post_id] || ''}
												on:input={(event) =>
													(commentDraftByPost = {
														...commentDraftByPost,
														[post.post_id]: (event.target as HTMLInputElement).value
													})}
												placeholder="Write a comment"
											/>
											<button type="button" on:click={() => submitComment(post.post_id)}>Send</button>
										</div>
									</div>
								{/if}
							</article>
						{/each}
					</div>
				{/if}
			</main>

			<aside class="rail" aria-label="Social module contract rail">
				<section class="panel rail-card">
					<div class="section-head tight">
						<div>
							<div class="kicker">Runtime state</div>
							<h3>Shell contract</h3>
						</div>
						<span class="pill success">Active</span>
					</div>
					<div class="contract-row"><span>Version</span><small>{moduleVersion}</small></div>
					<div class="contract-row"><span>Surface</span><small>{surfaceTitle()}</small></div>
					<div class="contract-row"><span>API</span><small>{apiBase}</small></div>
				</section>

				<section class="panel contract-grid" aria-label="Social module contracts">
					<div class="contract-card" data-widgets-visible="true">
						<div class="kicker">Widgets</div>
						<h3>Board-ready</h3>
						{#each (contract?.widgets || []) as widget}
							<div class="contract-row"><span>{widget.id}</span><small>{widget.title}</small></div>
						{/each}
					</div>
					<div class="contract-card" data-functions-visible="true">
						<div class="kicker">Functions</div>
						<h3>Callable</h3>
						{#each (contract?.functions || []) as fn}
							<div class="contract-row"><span>{fn.id}</span><small>{fn.permission}</small></div>
						{/each}
					</div>
					<div class="contract-card" data-permissions-visible="true">
						<div class="kicker">Permissions</div>
						<h3>Runtime grants</h3>
						{#each (contract?.permissions || []) as perm}
							<div class="contract-row"><span>{perm.id}</span><small>{perm.risk}</small></div>
						{/each}
					</div>
					<div class="contract-card" data-notifications-visible="true">
						<div class="kicker">Notifications</div>
						<h3>Channels</h3>
						{#each (contract?.notifications || []) as notification}
							<div class="contract-row"><span>{notification.id}</span><small>{notification.default_enabled ? 'enabled' : 'off'}</small></div>
						{/each}
					</div>
				</section>
			</aside>
		</div>
	{/if}
</section>

<style>
	.social-module {
		display: grid;
		gap: 1rem;
		color: var(--modula-text, var(--text-primary, var(--token-text, currentColor)));
		--social-surface: var(--surface-secondary, var(--modula-surface, color-mix(in srgb, currentColor 7%, transparent)));
		--social-surface-raised: var(--surface-tertiary, var(--modula-surface-elevated, color-mix(in srgb, currentColor 10%, transparent)));
		--social-surface-inset: var(--surface-sunken, color-mix(in srgb, currentColor 5%, transparent));
		--social-border: var(--border-subtle, var(--modula-border, color-mix(in srgb, currentColor 16%, transparent)));
		--social-muted: var(--text-secondary, var(--modula-muted, color-mix(in srgb, currentColor 62%, transparent)));
		--social-accent: var(--accent-primary, var(--accent, var(--modula-accent, currentColor)));
		--social-accent-contrast: var(--accent-contrast, var(--modula-accent-contrast, var(--surface-primary, currentColor)));
	}

	.panel {
		border-radius: var(--radius-xl, var(--modula-radius-lg, 18px));
		border: 1px solid var(--social-border);
		background:
			linear-gradient(135deg, color-mix(in srgb, var(--social-accent) 7%, transparent), transparent 48%),
			color-mix(in srgb, var(--social-surface) 88%, transparent);
		padding: 1rem;
	}

	.hero {
		display: grid;
		gap: 0.9rem;
	}

	.hero-copy {
		display: grid;
		gap: 0.45rem;
	}

	.eyebrow-row,
	.identity-row {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		flex-wrap: wrap;
	}

	h2,
	h3,
	p {
		margin: 0;
	}

	h2 {
		font-size: clamp(1.4rem, 2vw, 2rem);
		letter-spacing: -0.04em;
	}

	h3 {
		font-size: 1rem;
		letter-spacing: -0.02em;
	}

	.kicker {
		font-size: 0.68rem;
		letter-spacing: 0.13em;
		text-transform: uppercase;
		color: var(--social-muted);
	}

	.muted {
		color: var(--social-muted);
	}

	.tabs,
	.segmented,
	.composer-tools,
	.post-actions,
	.reaction-bar,
	.topic-list,
	.quick-tags {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.tabs a,
	button,
	select,
	input,
	textarea {
		font: inherit;
		color: inherit;
	}

	.tabs a,
	button,
	select,
	input,
	textarea,
	.pill,
	.mini-panel,
	.contract-row,
	.metric-grid > div {
		border-radius: var(--radius-lg, var(--modula-radius-md, 14px));
		border: 1px solid var(--social-border);
		background: color-mix(in srgb, var(--social-surface-raised) 82%, transparent);
	}

	.tabs a,
	button {
		text-decoration: none;
		padding: 0.52rem 0.72rem;
		cursor: pointer;
	}

	.tabs a.active,
	button.active,
	button.primary {
		background: color-mix(in srgb, var(--social-accent) 76%, transparent);
		border-color: color-mix(in srgb, var(--social-accent) 82%, transparent);
		color: var(--social-accent-contrast);
	}

	button.ghost {
		background: transparent;
	}

	button:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	textarea,
	input,
	select {
		padding: 0.65rem 0.75rem;
		outline: none;
	}

	input:focus,
	select:focus,
	textarea:focus {
		border-color: color-mix(in srgb, var(--social-accent) 72%, transparent);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--social-accent) 16%, transparent);
	}

	textarea {
		min-height: 6.5rem;
		width: 100%;
		resize: vertical;
	}

	.metric-grid,
	.contract-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.55rem;
	}

	.metric-grid.compact {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.metric-grid > div {
		display: grid;
		gap: 0.15rem;
		padding: 0.65rem;
	}

	.metric-grid span {
		font-size: 1.08rem;
		font-weight: 800;
	}

	.metric-grid small,
	.contract-row small {
		color: var(--social-muted);
	}

	.content-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(15rem, 0.34fr);
		gap: 1rem;
		align-items: start;
	}

	.main-column,
	.rail {
		display: grid;
		gap: 0.8rem;
	}

	.section-head {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.section-head.tight {
		margin-bottom: 0.4rem;
	}

	.composer,
	.discovery,
	.post,
	.profile-card,
	.contract-card,
	.comments {
		display: grid;
		gap: 0.7rem;
	}

	.discovery-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.6rem;
	}

	.mini-panel {
		display: grid;
		gap: 0.35rem;
		padding: 0.75rem;
	}

	.stack {
		display: grid;
		gap: 0.75rem;
	}

	.post-head {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: 0.65rem;
		align-items: center;
	}

	.avatar {
		width: 2.35rem;
		height: 2.35rem;
		border-radius: 999px;
		display: grid;
		place-items: center;
		font-size: 0.75rem;
		font-weight: 800;
		background: color-mix(in srgb, var(--social-accent) 34%, transparent);
		border: 1px solid color-mix(in srgb, var(--social-accent) 45%, transparent);
	}

	.avatar.self {
		width: 2.65rem;
		height: 2.65rem;
	}

	.post-body {
		font-size: 0.98rem;
		line-height: 1.55;
		white-space: pre-wrap;
	}

	.reaction-bar button {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.45rem;
		min-width: 6.6rem;
	}

	.reaction-bar strong {
		font-size: 0.78rem;
	}

	.comments {
		padding-top: 0.7rem;
		border-top: 1px solid var(--social-border);
	}

	.comment {
		padding: 0.62rem;
		border-radius: var(--radius-lg, var(--modula-radius-md, 12px));
		background: var(--social-surface-inset);
	}

	.comment-compose {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 0.5rem;
	}

	.topic-list span,
	.pill {
		font-size: 0.78rem;
		padding: 0.28rem 0.62rem;
	}

	.contract-card {
		align-content: start;
	}

	.contract-row {
		display: grid;
		gap: 0.1rem;
		padding: 0.55rem;
	}

	.status {
		text-align: center;
	}

	.status.error {
		border-color: color-mix(in srgb, var(--accent-danger, var(--modula-danger, currentColor)) 55%, transparent);
	}

	.pill.success {
		border-color: color-mix(in srgb, var(--social-accent) 55%, transparent);
		background: color-mix(in srgb, var(--social-accent) 14%, transparent);
	}

	@media (max-width: 860px) {
		.content-grid {
			grid-template-columns: 1fr;
		}

		.metric-grid,
		.contract-grid,
		.discovery-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.composer-tools,
		.post-actions,
		.reaction-bar {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 560px) {
		.metric-grid,
		.metric-grid.compact,
		.contract-grid,
		.discovery-grid,
		.composer-tools,
		.post-actions,
		.reaction-bar,
		.comment-compose {
			grid-template-columns: 1fr;
		}

		.post-head {
			grid-template-columns: auto 1fr;
		}

		.post-head .menu {
			grid-column: 1 / -1;
		}
	}
</style>
