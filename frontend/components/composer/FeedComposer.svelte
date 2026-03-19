<script lang="ts">
  import type { Post } from '../../../src/lib/social-store';

  export let body = '';
  export let visibility: Post['visibility'] = 'public';
  export let mediaUrl = '';
  export let mediaAlt = '';
  export let onSubmit: () => void;
</script>

<section class="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
  <div class="flex items-center justify-between gap-3">
    <div>
      <div class="text-[11px] uppercase tracking-[0.24em] text-slate-500 dark:text-white/45">Composer</div>
      <h2 class="mt-1 text-lg font-semibold">Publish an identity-linked post</h2>
    </div>
    <span class="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 dark:border-white/10 dark:text-white/60">
      {visibility}
    </span>
  </div>

  <textarea
    bind:value={body}
    placeholder="What should your identity publish next?"
    class="mt-4 h-32 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none dark:border-white/10 dark:bg-slate-950"
  />

  <div class="mt-4 grid gap-3 md:grid-cols-[180px_minmax(0,1fr)]">
    <label class="block">
      <div class="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-white/45">Visibility</div>
      <select bind:value={visibility} class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-950">
        <option value="public">Public</option>
        <option value="followers">Followers</option>
        <option value="private">Private</option>
      </select>
    </label>
    <label class="block">
      <div class="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-white/45">Media URL</div>
      <input bind:value={mediaUrl} type="url" placeholder="https://…" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-950" />
    </label>
  </div>

  {#if mediaUrl.trim()}
    <label class="mt-3 block">
      <div class="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-white/45">Media alt text</div>
      <input bind:value={mediaAlt} type="text" placeholder="Describe the attachment" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-950" />
    </label>
  {/if}

  <div class="mt-4 flex items-center justify-between gap-3">
    <p class="text-xs text-slate-500 dark:text-white/45">This package source now models visibility and media in the composer instead of flattening everything to plain text.</p>
    <button
      type="button"
      on:click={() => onSubmit?.()}
      disabled={!body.trim()}
      class="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
    >
      Publish
    </button>
  </div>
</section>
