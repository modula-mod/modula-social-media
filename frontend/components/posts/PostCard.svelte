<script lang="ts">
  import type { Post } from '../../../src/lib/social-store';
  import { bookmarkPost, likePost, repostPost, votePoll } from '../../../src/lib/social-store';
  import CommentComposer from '../comments/CommentComposer.svelte';
  import CommentList from '../comments/CommentList.svelte';
  import PostBody from './PostBody.svelte';
  import PostHeader from './PostHeader.svelte';
  import PostMedia from './PostMedia.svelte';
  import ReactionBar from '../reactions/ReactionBar.svelte';

  export let post: Post;
</script>

<article class="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
  <div class="flex gap-3">
    <img src={post.author.avatar} alt={post.author.displayName} class="h-11 w-11 flex-shrink-0 rounded-full object-cover" />
    <div class="min-w-0 flex-1">
      <PostHeader {post} />
      <PostBody {post} />
      <PostMedia {post} />

      {#if post.poll}
        <div class="mt-3 space-y-2">
          {#each post.poll.options as option}
            <button type="button" on:click={() => votePoll(post.id, option.id)} class="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-2 text-sm dark:border-white/10">
              <span>{option.text}</span>
              <span class="text-slate-500 dark:text-white/50">{option.percentage}%</span>
            </button>
          {/each}
        </div>
      {/if}

      <ReactionBar
        {post}
        onLike={() => likePost(post.id)}
        onRepost={() => repostPost(post.id)}
        onBookmark={() => bookmarkPost(post.id)}
      />
      <CommentComposer />
      <CommentList {post} />
    </div>
  </div>
</article>
