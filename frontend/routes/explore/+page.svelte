<script lang="ts">
  import FeedShell from '../../components/layout/FeedShell.svelte';
  import ActivityRail from '../../components/activity/ActivityRail.svelte';
  import SocialWidgetPreview from '../../components/widgets/SocialWidgetPreview.svelte';
</script>

<FeedShell title="Explore" subtitle="Discovery stays identity-native: trending topics, suggested identities, and Board-ready widgets all hang off the Social package contract.">
  <section class="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
    <div class="text-[11px] uppercase tracking-[0.24em] text-slate-500 dark:text-white/45">Explore</div>
    <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-white/60">
      This route stays intentionally small because discovery inputs should compose from separate topic, identity, and widget components instead of being hard-coded into one page file.
    </p>
  </section>

  <svelte:fragment slot="rail">
    <ActivityRail />
    <SocialWidgetPreview />
  </svelte:fragment>
</FeedShell>
