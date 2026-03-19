<script lang="ts">
  import { suggestedUsers, trendingTags, followUser } from '../../../src/lib/social-store';
</script>

<section class="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
  <div class="text-[11px] uppercase tracking-[0.24em] text-slate-500 dark:text-white/45">Discovery</div>
  <h2 class="mt-1 text-lg font-semibold text-slate-900 dark:text-white">Trending topics</h2>
  <div class="mt-4 space-y-3">
    {#each $trendingTags.slice(0, 5) as tag}
      <div class="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-white/5">
        <div class="font-medium text-slate-900 dark:text-white">#{tag.tag}</div>
        <div class="text-xs text-slate-500 dark:text-white/50">{tag.count.toLocaleString()} posts</div>
      </div>
    {/each}
  </div>
</section>

<section class="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
  <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Suggested identities</h2>
  <div class="mt-4 space-y-3">
    {#each $suggestedUsers.slice(0, 3) as user}
      <div class="flex items-center gap-3">
        <img src={user.avatar} alt={user.displayName} class="h-10 w-10 rounded-full object-cover" />
        <div class="min-w-0 flex-1">
          <div class="truncate font-medium text-slate-900 dark:text-white">{user.displayName}</div>
          <div class="truncate text-sm text-slate-500 dark:text-white/50">@{user.username}</div>
        </div>
        <button type="button" on:click={() => followUser(user.id)} class="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white dark:bg-white dark:text-slate-950">
          Follow
        </button>
      </div>
    {/each}
  </div>
</section>
