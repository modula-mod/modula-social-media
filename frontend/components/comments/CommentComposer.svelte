<script lang="ts">
  export let onSubmitComment: (content: string) => void;

  let draft = '';

  $: hashtags = Array.from(draft.matchAll(/#([a-zA-Z0-9_]+)/g)).map((match) => match[1].toLowerCase());
  $: mentions = Array.from(draft.matchAll(/@([a-zA-Z0-9_]+)/g)).map((match) => match[1].toLowerCase());

  function submit() {
    const next = draft.trim();
    if (!next) return;
    onSubmitComment?.(next);
    draft = '';
  }
</script>

<div class="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
  <textarea
    bind:value={draft}
    placeholder="Add a comment, @mention someone, or use #hashtags"
    class="h-20 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none dark:border-white/10 dark:bg-slate-950"
  />

  <div class="mt-2 flex items-center justify-between gap-3">
    <div class="text-[11px] text-slate-500 dark:text-white/45">
      {#if hashtags.length || mentions.length}
        {#if hashtags.length}
          <span>#{hashtags.join(' #')}</span>
        {/if}
        {#if hashtags.length && mentions.length}
          <span class="mx-1">·</span>
        {/if}
        {#if mentions.length}
          <span>@{mentions.join(' @')}</span>
        {/if}
      {:else}
        Tip: hashtags become feed filters.
      {/if}
    </div>
    <button
      type="button"
      on:click={submit}
      disabled={!draft.trim()}
      class="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
    >
      Comment
    </button>
  </div>
</div>
