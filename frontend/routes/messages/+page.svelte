<script lang="ts">
  import FeedShell from '../../components/layout/FeedShell.svelte';
  import ActivityRail from '../../components/activity/ActivityRail.svelte';

  const distinctions = [
    'Social messages stay lightweight and feed-adjacent.',
    'Durable inbox, drafts, and identity-to-identity threads remain a Mail concern.',
    'Keeping the split explicit prevents Social from becoming a generic clone of private messaging.'
  ];
</script>

<FeedShell title="Messages" subtitle="Social messaging remains distinct from private Mail threads and durable inbox state.">
  <svelte:fragment slot="actions">
    <a href="/mail/inbox" class="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium dark:border-white/10">Open Mail</a>
  </svelte:fragment>

  <section class="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
    <div class="text-[11px] uppercase tracking-[0.24em] text-slate-500 dark:text-white/45">Boundary</div>
    <div class="mt-4 space-y-3">
      {#each distinctions as item}
        <div class="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-white/5 dark:text-white/60">{item}</div>
      {/each}
    </div>
  </section>

  <svelte:fragment slot="rail">
    <ActivityRail />
  </svelte:fragment>
</FeedShell>
