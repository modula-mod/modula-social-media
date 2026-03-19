<script lang="ts">
  import type { Post } from '../../../src/lib/social-store';

  export let post: Post;
</script>

<p class="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-800 dark:text-white/80">{post.content}</p>

{#if post.tags.length > 0}
  <div class="mt-3 flex flex-wrap gap-2">
    {#each post.tags as tag}
      <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-white/5 dark:text-blue-300">#{tag}</span>
    {/each}
  </div>
{/if}
