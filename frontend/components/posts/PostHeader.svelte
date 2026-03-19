<script lang="ts">
  import type { Post } from '../../../src/lib/social-store';
  import { formatRelativeTime } from '../../lib/helpers';

  export let post: Post;
</script>

<div class="flex items-center gap-2 text-sm">
  <span class="truncate font-semibold text-slate-900 dark:text-white">{post.author.displayName}</span>
  {#if post.author.verified}
    <span class="text-blue-500">●</span>
  {/if}
  <span class="truncate text-slate-500 dark:text-white/50">@{post.author.username}</span>
  <span class="text-slate-400 dark:text-white/30">·</span>
  <span class="flex-shrink-0 text-slate-500 dark:text-white/50">{formatRelativeTime(post.createdAt)}</span>
</div>
