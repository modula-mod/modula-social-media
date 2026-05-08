<script lang="ts">
	import { onMount } from 'svelte';
	import {
		createComment,
		createPost,
		loadComments,
		loadExplore,
		loadFeed,
		loadMyProfile,
		normalizeSurfaceId,
		reactToPost,
		resolveApiBase
	} from './lib/api';
	import type {
		ModulaContext,
		SocialComment,
		SocialPost,
		SocialProfileMePayload,
		Visibility
	} from './lib/types';

	export let modula: ModulaContext = {};

	let mounted = false;
	let loading = true;
	let error = '';

	let feedPosts: SocialPost[] = [];
	let explorePosts: SocialPost[] = [];
	let trendingTopics: string[] = [];
	let profile: SocialProfileMePayload | null = null;
	let profilePosts: SocialPost[] = [];

	let commentsByPost: Record<string, SocialComment[]> = {};
	let commentDraftByPost: Record<string, string> = {};
	let commentsLoadingByPost: Record<string, boolean> = {};

	let composerBody = '';
	let composerVisibility: Visibility = 'public';

	let lastSurfaceKey = '';

	$: apiBase = resolveApiBase(modula);
	$: surfaceId = normalizeSurfaceId(modula);
	$: surfaceKey = `${apiBase}:${surfaceId}`;

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

	async function refreshSurface() {
		loading = true;
		error = '';

		try {
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

		try {
			const created = await createPost(apiBase, body, composerVisibility);
			if (created?.post) {
				feedPosts = [created.post, ...feedPosts];
			}
			composerBody = '';
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to create post.';
		}
	}

	async function submitReaction(postId: string, reactionType = 'like') {
		try {
			const mutation = await reactToPost(apiBase, postId, reactionType);
			if (!mutation.post) return;
			feedPosts = feedPosts.map((item) => (item.post_id === postId ? mutation.post! : item));
			profilePosts = profilePosts.map((item) => (item.post_id === postId ? mutation.post! : item));
			explorePosts = explorePosts.map((item) => (item.post_id === postId ? mutation.post! : item));
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to react to post.';
		}
	}

	async function openComments(postId: string) {
		if (commentsLoadingByPost[postId]) return;

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
				commentsByPost = {
					...commentsByPost,
					[postId]: [...existing, mutation.comment]
				};
			}
			if (mutation.post) {
				feedPosts = feedPosts.map((item) => (item.post_id === postId ? mutation.post! : item));
				profilePosts = profilePosts.map((item) => (item.post_id === postId ? mutation.post! : item));
				explorePosts = explorePosts.map((item) => (item.post_id === postId ? mutation.post! : item));
			}
			commentDraftByPost = { ...commentDraftByPost, [postId]: '' };
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to add comment.';
		}
	}

	function surfaceTitle(): string {
		if (surfaceId === 'explore') return 'Explore';
		if (surfaceId === 'profile') return 'Social Profile';
		if (surfaceId === 'reels') return 'Reels';
		return 'Social Feed';
	}
</script>

<section class="social-module" aria-label="Social module runtime">
	<header class="panel header">
		<div>
			<div class="kicker">Modula Social Module</div>
			<h2>{surfaceTitle()}</h2>
			<p>
				Surface <strong>{surfaceId}</strong> · API <strong>{apiBase}</strong>
			</p>
		</div>
		<nav class="tabs" aria-label="Social surfaces">
			<a href="/social" class:active={surfaceId === 'feed'}>Feed</a>
			<a href="/social/explore" class:active={surfaceId === 'explore'}>Explore</a>
			<a href="/social/profile" class:active={surfaceId === 'profile'}>Profile</a>
			<a href="/social/reels" class:active={surfaceId === 'reels'}>Reels</a>
		</nav>
	</header>

	{#if loading}
		<div class="panel status">Loading {surfaceTitle().toLowerCase()}…</div>
	{:else if error}
		<div class="panel status error">{error}</div>
	{:else if surfaceId === 'feed'}
		<section class="panel composer">
			<textarea bind:value={composerBody} placeholder="Share with your network..."></textarea>
			<div class="row">
				<select bind:value={composerVisibility}>
					<option value="public">Public</option>
					<option value="followers">Followers</option>
					<option value="private">Private</option>
				</select>
				<button type="button" on:click={submitPost} disabled={!composerBody.trim()}>Post</button>
			</div>
		</section>

		{#if feedPosts.length === 0}
			<div class="panel status">No posts yet. Create the first post from the composer above.</div>
		{:else}
			<div class="stack">
				{#each feedPosts as post (post.post_id)}
					<article class="panel post">
						<div class="post-head">
							<div class="avatar">{post.author.display_name.slice(0, 2).toUpperCase()}</div>
							<div>
								<strong>{post.author.display_name}</strong>
								<div class="muted">@{post.author.handle} · {formatTime(post.created_at)}</div>
							</div>
						</div>
						<p>{post.body}</p>
						<div class="metrics muted">
							<span>Reactions: {post.reaction_count}</span>
							<span>Comments: {post.comment_count}</span>
						</div>
						<div class="row">
							<button type="button" on:click={() => submitReaction(post.post_id, 'like')}>Like</button>
							<button type="button" on:click={() => submitReaction(post.post_id, 'love')}>Love</button>
							<button type="button" on:click={() => openComments(post.post_id)}>Comments</button>
						</div>
						{#if commentsByPost[post.post_id]}
							<div class="comments">
								{#if commentsByPost[post.post_id].length === 0}
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
								<div class="row">
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
	{:else if surfaceId === 'explore'}
		{#if trendingTopics.length}
			<div class="panel topics">
				<div class="kicker">Trending Topics</div>
				<div class="topic-list">
					{#each trendingTopics as topic}
						<span>#{topic}</span>
					{/each}
				</div>
			</div>
		{/if}
		{#if explorePosts.length === 0}
			<div class="panel status">Explore is empty right now.</div>
		{:else}
			<div class="stack">
				{#each explorePosts as post (post.post_id)}
					<article class="panel post">
						<strong>{post.author.display_name}</strong>
						<div class="muted">@{post.author.handle} · {formatTime(post.created_at)}</div>
						<p>{post.body}</p>
					</article>
				{/each}
			</div>
		{/if}
	{:else if surfaceId === 'profile'}
		{#if !profile}
			<div class="panel status">Profile not available.</div>
		{:else}
			<div class="panel profile-card">
				<div class="kicker">My Profile</div>
				<h3>{profile.profile.display_name}</h3>
				<div class="muted">@{profile.profile.handle}</div>
				<div class="metrics muted">
					<span>Posts: {profile.post_count}</span>
					<span>Followers: {profile.follower_count}</span>
					<span>Following: {profile.following_count}</span>
				</div>
			</div>
			{#if profilePosts.length === 0}
				<div class="panel status">You have no posts yet.</div>
			{:else}
				<div class="stack">
					{#each profilePosts as post (post.post_id)}
						<article class="panel post">
							<div class="muted">{formatTime(post.created_at)}</div>
							<p>{post.body}</p>
						</article>
					{/each}
				</div>
			{/if}
		{/if}
	{:else}
		<div class="panel status">
			<strong>Reels plugin surface</strong>
			<p class="muted">Reels is installed and routed via plugin surface contracts.</p>
			{#if explorePosts.length === 0}
				<div class="muted">No reels available yet.</div>
			{:else}
				<div class="stack compact">
					{#each explorePosts as post (post.post_id)}
						<article class="panel post compact">
							<strong>{post.author.display_name}</strong>
							<p>{post.body}</p>
						</article>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</section>

<style>
	.social-module {
		display: grid;
		gap: 0.9rem;
		color: var(--modula-text, var(--token-text, #e8ecf3));
	}

	.panel {
		border-radius: 14px;
		border: 1px solid var(--modula-border, var(--token-border, rgba(255, 255, 255, 0.12)));
		background: var(--modula-surface, var(--token-surface, rgba(14, 18, 26, 0.72)));
		padding: 0.9rem;
	}

	.header {
		display: grid;
		gap: 0.8rem;
	}

	h2,
	h3,
	p {
		margin: 0;
	}

	.kicker {
		font-size: 0.68rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--modula-muted, #9aa6ba);
	}

	.tabs {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.tabs a {
		text-decoration: none;
		font-size: 0.84rem;
		color: inherit;
		padding: 0.35rem 0.65rem;
		border-radius: 999px;
		border: 1px solid var(--modula-border, rgba(255, 255, 255, 0.16));
	}

	.tabs a.active {
		background: color-mix(in srgb, var(--modula-accent, #5ec5ff) 20%, transparent);
		border-color: color-mix(in srgb, var(--modula-accent, #5ec5ff) 60%, var(--modula-border, #73839b));
	}

	textarea,
	input,
	select,
	button {
		font: inherit;
	}

	textarea,
	input,
	select {
		border-radius: 10px;
		border: 1px solid var(--modula-border, rgba(255, 255, 255, 0.14));
		background: var(--modula-surface-elevated, rgba(0, 0, 0, 0.18));
		color: inherit;
		padding: 0.55rem 0.65rem;
	}

	textarea {
		min-height: 6rem;
		width: 100%;
	}

	button {
		border-radius: 10px;
		border: 1px solid var(--modula-border, rgba(255, 255, 255, 0.16));
		background: color-mix(in srgb, var(--modula-accent, #5ec5ff) 18%, transparent);
		color: inherit;
		padding: 0.45rem 0.75rem;
		cursor: pointer;
	}

	button:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	.row {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.stack {
		display: grid;
		gap: 0.7rem;
	}

	.stack.compact {
		gap: 0.45rem;
	}

	.post {
		display: grid;
		gap: 0.55rem;
	}

	.post.compact {
		padding: 0.65rem;
	}

	.post-head {
		display: flex;
		gap: 0.6rem;
		align-items: center;
	}

	.avatar {
		width: 2rem;
		height: 2rem;
		border-radius: 999px;
		display: grid;
		place-items: center;
		font-size: 0.72rem;
		font-weight: 700;
		background: color-mix(in srgb, var(--modula-accent, #5ec5ff) 70%, #122036);
		color: #fff;
	}

	.comments {
		display: grid;
		gap: 0.45rem;
		padding-top: 0.3rem;
	}

	.comment {
		padding: 0.5rem;
		border-radius: 10px;
		background: color-mix(in srgb, var(--modula-surface, #151a24) 85%, #fff 4%);
	}

	.topics .topic-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-top: 0.45rem;
	}

	.topics .topic-list span {
		font-size: 0.78rem;
		padding: 0.24rem 0.55rem;
		border-radius: 999px;
		border: 1px solid var(--modula-border, rgba(255, 255, 255, 0.15));
	}

	.metrics {
		display: flex;
		gap: 0.65rem;
		flex-wrap: wrap;
	}

	.muted {
		color: var(--modula-muted, #9aa6ba);
	}

	.status {
		text-align: center;
	}

	.status.error {
		border-color: rgba(239, 68, 68, 0.35);
		background: rgba(239, 68, 68, 0.1);
	}
</style>
