<script lang="ts">
  import type { Post } from '../../../src/lib/social-store';

  export let post: Post;
</script>

<div class="mt-3 rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-sm text-slate-500 dark:border-white/10 dark:text-white/50">
  {post.comments} comments are attached to this post in the package reference model. The live host implementation persists full comment records through the backend Social service.
</div>
