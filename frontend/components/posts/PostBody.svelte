<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Post } from '../../../src/lib/social-store';

  export let post: Post;

  const dispatch = createEventDispatcher<{ hashtag: { tag: string } }>();

  type ContentToken = { type: 'text' | 'hashtag' | 'mention'; value: string };

  function tokenize(content: string): ContentToken[] {
    const chunks = content.split(/([#@][a-zA-Z0-9_]+)/g).filter((part) => part.length > 0);
    return chunks.map((chunk) => {
      if (/^#[a-zA-Z0-9_]+$/.test(chunk)) {
        return { type: 'hashtag', value: chunk };
      }

      if (/^@[a-zA-Z0-9_]+$/.test(chunk)) {
        return { type: 'mention', value: chunk };
      }

      return { type: 'text', value: chunk };
    });
  }

  function chooseHashtag(tag: string) {
    dispatch('hashtag', { tag: tag.replace(/^#/, '').toLowerCase() });
  }

  $: contentTokens = tokenize(post.content);
  $: mergedTags = Array.from(new Set([...post.tags, ...post.hashtags]));
</script>

<p class="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-800 dark:text-white/80">
  {#each contentTokens as token}
    {#if token.type === 'hashtag'}
      <button
        type="button"
        class="inline rounded px-0.5 font-medium text-blue-600 transition hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-500/10"
        on:click={() => chooseHashtag(token.value)}
      >
        {token.value}
      </button>
    {:else if token.type === 'mention'}
      <span class="font-medium text-violet-600 dark:text-violet-300">{token.value}</span>
    {:else}
      <span>{token.value}</span>
    {/if}
  {/each}
</p>

{#if mergedTags.length > 0}
  <div class="mt-3 flex flex-wrap gap-2">
    {#each mergedTags as tag}
      <button
        type="button"
        class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-blue-600 transition hover:bg-blue-50 dark:bg-white/5 dark:text-blue-300 dark:hover:bg-blue-500/10"
        on:click={() => chooseHashtag(tag)}
      >
        #{tag}
      </button>
    {/each}
  </div>
{/if}
