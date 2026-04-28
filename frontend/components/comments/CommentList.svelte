<script lang="ts">
  import type { Post } from '../../../src/lib/social-store';
  import { formatRelativeTime } from '../../lib/helpers';

  export let post: Post;
  export let onToggleLike: (commentId: string) => void;

  function renderCommentTokens(content: string): Array<{ type: 'text' | 'hashtag' | 'mention'; value: string }> {
    const raw = content.split(/([#@][a-zA-Z0-9_]+)/g).filter((part) => part.length > 0);
    return raw.map((part) => {
      if (/^#[a-zA-Z0-9_]+$/.test(part)) {
        return { type: 'hashtag', value: part };
      }

      if (/^@[a-zA-Z0-9_]+$/.test(part)) {
        return { type: 'mention', value: part };
      }

      return { type: 'text', value: part };
    });
  }
</script>

<div class="mt-3 space-y-2">
  {#if post.commentList.length === 0}
    <div class="rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-sm text-slate-500 dark:border-white/10 dark:text-white/50">
      No comments yet — be the first one.
    </div>
  {:else}
    {#each post.commentList as comment (comment.id)}
      <article class="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 dark:border-white/10 dark:bg-slate-950/40">
        <div class="flex items-start gap-2.5">
          <img src={comment.author.avatar} alt={comment.author.displayName} class="mt-0.5 h-8 w-8 rounded-full object-cover" />
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-1.5 text-xs">
              <span class="truncate font-semibold text-slate-900 dark:text-white">{comment.author.displayName}</span>
              <span class="truncate text-slate-500 dark:text-white/50">@{comment.author.username}</span>
              <span class="text-slate-400 dark:text-white/30">·</span>
              <span class="text-slate-500 dark:text-white/50">{formatRelativeTime(comment.createdAt)}</span>
            </div>

            <p class="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-white/75">
              {#each renderCommentTokens(comment.content) as token}
                {#if token.type === 'hashtag'}
                  <span class="font-medium text-blue-600 dark:text-blue-300">{token.value}</span>
                {:else if token.type === 'mention'}
                  <span class="font-medium text-violet-600 dark:text-violet-300">{token.value}</span>
                {:else}
                  <span>{token.value}</span>
                {/if}
              {/each}
            </p>

            <div class="mt-1.5 flex items-center gap-3 text-xs">
              <button
                type="button"
                on:click={() => onToggleLike?.(comment.id)}
                class="rounded-full px-2 py-1 text-slate-500 hover:bg-rose-50 hover:text-rose-500 dark:text-white/50 dark:hover:bg-rose-500/10"
                class:text-rose-500={comment.isLiked}
              >
                ♥ {comment.likes}
              </button>

              {#if comment.hashtags.length > 0}
                <span class="truncate text-slate-400 dark:text-white/30">{comment.hashtags.map((tag) => `#${tag}`).join(' ')}</span>
              {/if}
            </div>
          </div>
        </div>
      </article>
    {/each}
  {/if}
</div>
