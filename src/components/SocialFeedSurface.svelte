<script lang="ts">
  import { onMount } from 'svelte';
  import {
    bookmarkPost,
    createPost,
    feedFilter,
    feedLoading,
    feedPosts,
    followUser,
    likePost,
    loadFeed,
    repostPost,
    suggestedUsers,
    trendingTags,
    votePoll
  } from '../lib/social-store';

  let newPostContent = '';
  let showComposer = false;

  onMount(() => {
    loadFeed();
  });

  function handleCreatePost() {
    if (!newPostContent.trim()) return;
    createPost(newPostContent);
    newPostContent = '';
    showComposer = false;
  }

  function formatTime(date: Date | string) {
    const value = typeof date === 'string' ? new Date(date) : date;
    if (!value || Number.isNaN(value.getTime())) return '';

    const now = new Date();
    const diff = now.getTime() - value.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  }
</script>

<div class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
  <div class="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-slate-950/95">
    <div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
      <div>
        <div class="text-[11px] uppercase tracking-[0.24em] text-slate-500 dark:text-white/45">Modula Module</div>
        <h1 class="text-xl font-bold">Social</h1>
      </div>
      <button
        on:click={() => (showComposer = !showComposer)}
        class="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-600"
      >
        <span class="hidden sm:inline">New Post</span>
        <span class="sm:hidden">+</span>
      </button>
    </div>

    <div class="mx-auto flex max-w-3xl px-4">
      {#each ['all', 'following', 'trending'] as filter}
        <button
          on:click={() => loadFeed(filter as 'all' | 'following' | 'trending')}
          class="flex-1 border-b-2 py-3 text-sm font-medium capitalize transition-colors"
          class:border-blue-500={$feedFilter === filter}
          class:text-blue-500={$feedFilter === filter}
          class:border-transparent={$feedFilter !== filter}
          class:text-slate-500={$feedFilter !== filter}
        >
          {filter === 'all' ? 'For You' : filter}
        </button>
      {/each}
    </div>
  </div>

  <div class="mx-auto max-w-3xl xl:mr-[22rem] xl:max-w-[calc(100%-24rem)]">
    {#if showComposer}
      <div class="border-b border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
        <textarea
          bind:value={newPostContent}
          placeholder="What's happening?"
          class="min-h-[100px] w-full resize-none bg-transparent text-lg placeholder-slate-400 focus:outline-none dark:placeholder-white/40"
        />
        <div class="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-white/5">
          <div class="flex gap-2">
            <button class="rounded-full p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <button class="rounded-full p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          <button
            on:click={handleCreatePost}
            disabled={!newPostContent.trim()}
            class="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-600 disabled:opacity-50"
          >
            Post
          </button>
        </div>
      </div>
    {/if}

    {#if $feedLoading}
      <div class="flex items-center justify-center py-12">
        <div class="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
      </div>
    {:else}
      <div class="divide-y divide-slate-200 dark:divide-white/10">
        {#each $feedPosts as post (post.id)}
          <article class="bg-white p-4 transition hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/50">
            <div class="flex gap-3">
              <img src={post.author.avatar} alt={post.author.displayName} class="h-10 w-10 flex-shrink-0 rounded-full object-cover" />
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 text-sm">
                  <span class="truncate font-semibold">{post.author.displayName}</span>
                  {#if post.author.verified}
                    <svg class="h-4 w-4 flex-shrink-0 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  {/if}
                  <span class="truncate text-slate-500 dark:text-white/50">@{post.author.username}</span>
                  <span class="text-slate-400 dark:text-white/30">·</span>
                  <span class="flex-shrink-0 text-slate-500 dark:text-white/50">{formatTime(post.createdAt)}</span>
                </div>

                <p class="mt-1.5 whitespace-pre-wrap">{post.content}</p>

                {#if post.tags.length > 0}
                  <div class="mt-2 flex flex-wrap gap-1.5">
                    {#each post.tags as tag}
                      <span class="text-sm text-blue-500 hover:underline">#{tag}</span>
                    {/each}
                  </div>
                {/if}

                {#if post.media.length > 0}
                  <div class="mt-3 grid gap-2" class:grid-cols-2={post.media.length > 1}>
                    {#each post.media as media}
                      {#if media.type === 'image'}
                        <img
                          src={media.url}
                          alt={media.altText || 'Post image'}
                          class="rounded-xl object-cover"
                          class:max-h-80={post.media.length === 1}
                          class:w-full={true}
                          class:aspect-square={post.media.length > 1}
                        />
                      {/if}
                    {/each}
                  </div>
                {/if}

                {#if post.poll}
                  <div class="mt-3 space-y-2">
                    {#each post.poll.options as option}
                      <button
                        on:click={() => votePoll(post.id, option.id)}
                        class="relative w-full overflow-hidden rounded-lg border border-slate-200 px-4 py-2 text-left transition-colors hover:border-blue-500 dark:border-white/10"
                      >
                        <div class="absolute inset-0 bg-blue-100 dark:bg-blue-500/20" style={`width:${option.percentage}%`}></div>
                        <div class="relative flex items-center justify-between">
                          <span class="text-sm">{option.text}</span>
                          <span class="text-sm text-slate-500 dark:text-white/50">{option.percentage}%</span>
                        </div>
                      </button>
                    {/each}
                    <p class="text-xs text-slate-500 dark:text-white/50">{post.poll.totalVotes} votes</p>
                  </div>
                {/if}

                <div class="mt-3 flex justify-between text-slate-500 dark:text-white/50">
                  <button class="group flex items-center gap-1.5 hover:text-blue-500">
                    <div class="rounded-full p-2 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <span class="text-xs">{post.comments}</span>
                  </button>
                  <button on:click={() => repostPost(post.id)} class="group flex items-center gap-1.5 hover:text-green-500" class:text-green-500={post.isReposted}>
                    <div class="rounded-full p-2 group-hover:bg-green-50 dark:group-hover:bg-green-500/10">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <span class="text-xs">{post.reposts}</span>
                  </button>
                  <button on:click={() => likePost(post.id)} class="group flex items-center gap-1.5 hover:text-rose-500" class:text-rose-500={post.isLiked}>
                    <div class="rounded-full p-2 group-hover:bg-rose-50 dark:group-hover:bg-rose-500/10">
                      <svg class="h-4 w-4" fill={post.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <span class="text-xs">{post.likes}</span>
                  </button>
                  <button on:click={() => bookmarkPost(post.id)} class="group flex items-center gap-1.5 hover:text-blue-500" class:text-blue-500={post.isBookmarked}>
                    <div class="rounded-full p-2 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10">
                      <svg class="h-4 w-4" fill={post.isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </article>
        {/each}
      </div>
    {/if}
  </div>

  <div class="fixed right-8 top-20 hidden w-80 xl:block">
    <div class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
      <h2 class="text-lg font-bold">Trending</h2>
      <div class="mt-3 space-y-3">
        {#each $trendingTags.slice(0, 5) as tag}
          <button class="block w-full text-left hover:bg-slate-50 dark:hover:bg-slate-800">
            <p class="font-medium">#{tag.tag}</p>
            <p class="text-xs text-slate-500 dark:text-white/50">{tag.count.toLocaleString()} posts</p>
          </button>
        {/each}
      </div>
    </div>

    <div class="mt-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
      <h2 class="text-lg font-bold">Who to follow</h2>
      <div class="mt-3 space-y-3">
        {#each $suggestedUsers.slice(0, 3) as user}
          <div class="flex items-center gap-3">
            <img src={user.avatar} alt={user.displayName} class="h-10 w-10 rounded-full" />
            <div class="min-w-0 flex-1">
              <p class="truncate font-medium">{user.displayName}</p>
              <p class="truncate text-sm text-slate-500 dark:text-white/50">@{user.username}</p>
            </div>
            <button
              on:click={() => followUser(user.id)}
              class="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Follow
            </button>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
