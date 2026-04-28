<script lang="ts">
  import type { FeedFilter } from '../../../src/lib/social-store';

  export let value: FeedFilter = 'all';
  export let onChange: (value: FeedFilter) => void;

  const filters: FeedFilter[] = ['all', 'following', 'trending'];
</script>

<div class="flex rounded-2xl border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-slate-900">
  {#each filters as filter}
    <button
      type="button"
      on:click={() => onChange?.(filter)}
      class={`flex-1 rounded-xl px-3 py-2 text-sm font-medium capitalize transition ${
        value === filter
          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
          : 'bg-transparent text-slate-500 dark:text-white/60'
      }`}
    >
      {filter === 'all' ? 'For you' : filter}
    </button>
  {/each}
</div>
