<script lang="ts">
  import type { Post } from '../../../src/lib/social-store';

  export let post: Post;
</script>

{#if post.media.length > 0}
  <div class="mt-3 grid gap-2" class:grid-cols-2={post.media.length > 1}>
    {#each post.media as media}
      {#if media.type === 'image'}
        <img
          src={media.url}
          alt={media.altText || 'Post media'}
          class="w-full rounded-2xl object-cover"
          class:max-h-80={post.media.length === 1}
          class:aspect-square={post.media.length > 1}
        />
      {/if}
    {/each}
  </div>
{/if}
