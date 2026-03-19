<script lang="ts">
  import { feedPosts } from '../../../src/lib/social-store';
  import FeedEmptyState from '../states/FeedEmptyState.svelte';
  import FeedLoadingState from '../states/FeedLoadingState.svelte';
  import PostCard from '../posts/PostCard.svelte';

  export let loading = false;
</script>

{#if loading}
  <FeedLoadingState />
{:else if $feedPosts.length === 0}
  <FeedEmptyState />
{:else}
  <div class="space-y-4">
    {#each $feedPosts as post (post.id)}
      <PostCard {post} />
    {/each}
  </div>
{/if}
