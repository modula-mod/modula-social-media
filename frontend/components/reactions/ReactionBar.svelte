<script lang="ts">
  import type { Post } from '../../../src/lib/social-store';

  export let post: Post;
  export let onLike: () => void;
  export let onRepost: () => void;
  export let onBookmark: () => void;
</script>

<div class="mt-4 flex items-center justify-between text-slate-500 dark:text-white/50">
  <button type="button" class="flex items-center gap-1.5 hover:text-blue-500">
    <span class="rounded-full p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10">💬</span>
    <span class="text-xs">{post.comments}</span>
  </button>
  <button type="button" on:click={() => onRepost?.()} class="flex items-center gap-1.5 hover:text-green-500" class:text-green-500={post.isReposted}>
    <span class="rounded-full p-2 hover:bg-green-50 dark:hover:bg-green-500/10">↻</span>
    <span class="text-xs">{post.reposts}</span>
  </button>
  <button type="button" on:click={() => onLike?.()} class="flex items-center gap-1.5 hover:text-rose-500" class:text-rose-500={post.isLiked}>
    <span class="rounded-full p-2 hover:bg-rose-50 dark:hover:bg-rose-500/10">♥</span>
    <span class="text-xs">{post.likes}</span>
  </button>
  <button type="button" on:click={() => onBookmark?.()} class="flex items-center gap-1.5 hover:text-blue-500" class:text-blue-500={post.isBookmarked}>
    <span class="rounded-full p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10">⌁</span>
  </button>
</div>
