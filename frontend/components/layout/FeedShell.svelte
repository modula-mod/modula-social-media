<script lang="ts">
  export let eyebrow = 'Social';
  export let title = 'Social';
  export let subtitle = '';
</script>

<div class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
  <div class="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-slate-950/95">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
      <div>
        <div class="text-[11px] uppercase tracking-[0.24em] text-slate-500 dark:text-white/45">{eyebrow}</div>
        <h1 class="mt-1 text-2xl font-bold">{title}</h1>
        {#if subtitle}
          <p class="mt-2 max-w-3xl text-sm text-slate-600 dark:text-white/60">{subtitle}</p>
        {/if}
      </div>
      <div class="flex items-center gap-2">
        <slot name="actions" />
      </div>
    </div>
  </div>

  <div class="mx-auto grid max-w-6xl gap-6 px-4 py-6 xl:grid-cols-[minmax(0,1fr)_320px]">
    <div class="min-w-0 space-y-4">
      <slot />
    </div>
    <aside class="space-y-4">
      <slot name="rail" />
    </aside>
  </div>
</div>
