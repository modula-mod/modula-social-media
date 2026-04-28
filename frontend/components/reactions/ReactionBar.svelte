<script lang="ts">
  import { REACTION_OPTIONS, type Post, type ReactionType } from '../../../src/lib/social-store';

  export let post: Post;
  export let onLike: () => void;
  export let onReact: (reaction: ReactionType) => void;
  export let onRepost: () => void;
  export let onBookmark: () => void;

  let pickerOpen = false;

  $: activeReaction = post.userReaction ? REACTION_OPTIONS.find((option) => option.type === post.userReaction) : null;
  $: totalReactions = Object.values(post.reactions ?? {}).reduce((total, count) => total + count, 0);
  $: topReactions = [...REACTION_OPTIONS]
    .map((option) => ({
      ...option,
      count: post.reactions?.[option.type] ?? 0
    }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  function selectReaction(reaction: ReactionType) {
    if (onReact) {
      onReact(reaction);
    } else if (reaction === 'like') {
      onLike?.();
    }
    pickerOpen = false;
  }
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
  <div class="relative">
    <button
      type="button"
      on:click={() => (pickerOpen = !pickerOpen)}
      class="flex items-center gap-1.5 rounded-full px-1 hover:text-rose-500"
      class:text-rose-500={post.isLiked}
      aria-haspopup="true"
      aria-expanded={pickerOpen}
    >
      <span class="rounded-full p-2 hover:bg-rose-50 dark:hover:bg-rose-500/10">{activeReaction?.emoji ?? '♥'}</span>
      <span class="text-xs">{totalReactions}</span>
    </button>

    {#if pickerOpen}
      <div class="absolute bottom-full right-0 z-10 mb-2 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg dark:border-white/10 dark:bg-slate-900">
        <div class="grid grid-cols-3 gap-1.5">
          {#each REACTION_OPTIONS as option}
            <button
              type="button"
              on:click={() => selectReaction(option.type)}
              class={`rounded-xl border border-transparent px-2 py-1.5 text-left text-xs transition hover:border-slate-200 hover:bg-slate-50 dark:hover:border-white/10 dark:hover:bg-white/5 ${
                post.userReaction === option.type ? 'border-slate-200 dark:border-white/20 bg-slate-50 dark:bg-white/5' : ''
              }`}
            >
              <div class="text-base leading-none">{option.emoji}</div>
              <div class="mt-1 text-[10px] text-slate-500 dark:text-white/50">{option.label}</div>
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>
  <button type="button" on:click={() => onBookmark?.()} class="flex items-center gap-1.5 hover:text-blue-500" class:text-blue-500={post.isBookmarked}>
    <span class="rounded-full p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10">⌁</span>
  </button>
</div>

{#if topReactions.length > 0}
  <div class="mt-2 flex flex-wrap gap-1.5">
    {#each topReactions as reaction}
      <span class="rounded-full border border-slate-200 px-2 py-0.5 text-[11px] dark:border-white/10">
        {reaction.emoji} {reaction.count}
      </span>
    {/each}
  </div>
{/if}
