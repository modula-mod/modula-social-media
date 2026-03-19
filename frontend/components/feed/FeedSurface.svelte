<script lang="ts">
  import { onMount } from 'svelte';
  import { feedFilter, feedLoading, loadFeed, createPost, type FeedFilter, type Post } from '../../../src/lib/social-store';
  import ActivityRail from '../activity/ActivityRail.svelte';
  import FeedComposer from '../composer/FeedComposer.svelte';
  import FeedFilters from './FeedFilters.svelte';
  import FeedList from './FeedList.svelte';
  import FeedShell from '../layout/FeedShell.svelte';
  import SocialWidgetPreview from '../widgets/SocialWidgetPreview.svelte';

  let body = '';
  let visibility: Post['visibility'] = 'public';
  let mediaUrl = '';
  let mediaAlt = '';

  onMount(() => {
    loadFeed();
  });

  function submitPost() {
    if (!body.trim()) return;
    createPost(body, {
      visibility,
      mediaUrl: mediaUrl.trim() || undefined,
      mediaAlt: mediaAlt.trim() || undefined
    });
    body = '';
    visibility = 'public';
    mediaUrl = '';
    mediaAlt = '';
  }

  function changeFilter(next: FeedFilter) {
    void loadFeed(next);
  }
</script>

<FeedShell
  title="Social"
  subtitle="GitHub-first package source for the flagship Social module. The route file assembles smaller components instead of owning the whole surface."
>
  <svelte:fragment slot="actions">
    <a href="/social/explore" class="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium dark:border-white/10">Explore</a>
    <a href="/social/notifications" class="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-slate-950">Notifications</a>
  </svelte:fragment>

  <FeedFilters value={$feedFilter} onChange={changeFilter} />
  <FeedComposer bind:body bind:visibility bind:mediaUrl bind:mediaAlt onSubmit={submitPost} />
  <FeedList loading={$feedLoading} />

  <svelte:fragment slot="rail">
    <ActivityRail />
    <SocialWidgetPreview />
  </svelte:fragment>
</FeedShell>
