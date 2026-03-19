<script lang="ts">
  import FeedShell from '../../components/layout/FeedShell.svelte';
  import ActivityRail from '../../components/activity/ActivityRail.svelte';

  const items = [
    'Comments and reactions on your posts should surface here.',
    'The live host implementation already turns Social activity into public and private notification streams.',
    'This package route keeps the notification surface split out so it can evolve without bloating the feed page.'
  ];
</script>

<FeedShell title="Notifications" subtitle="Private reactions and comments should feel like a real Social surface, not a side-effect hidden inside the feed.">
  <section class="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
    <div class="space-y-3">
      {#each items as item}
        <div class="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-white/5 dark:text-white/60">{item}</div>
      {/each}
    </div>
  </section>

  <svelte:fragment slot="rail">
    <ActivityRail />
  </svelte:fragment>
</FeedShell>
