import { writable, get } from 'svelte/store';

export type FeedFilter = 'all' | 'following' | 'trending';
export type ReactionType = 'like' | 'love' | 'laugh' | 'fire' | 'rocket' | 'celebrate';

export interface ReactionOption {
  type: ReactionType;
  emoji: string;
  label: string;
}

export const REACTION_OPTIONS: ReactionOption[] = [
  { type: 'like', emoji: '👍', label: 'Like' },
  { type: 'love', emoji: '❤️', label: 'Love' },
  { type: 'laugh', emoji: '😂', label: 'Laugh' },
  { type: 'fire', emoji: '🔥', label: 'Fire' },
  { type: 'rocket', emoji: '🚀', label: 'Rocket' },
  { type: 'celebrate', emoji: '🎉', label: 'Celebrate' }
];

export interface SocialUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  verified: boolean;
  followers: number;
  following: number;
  posts: number;
  createdAt: string;
  isFollowing?: boolean;
}

export interface PostMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  altText?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

export interface PostPoll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  endsAt: string;
  hasVoted: boolean;
  votedOption?: string;
}

export interface PostComment {
  id: string;
  author: SocialUser;
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  tags: string[];
  hashtags: string[];
  mentions: string[];
}

export interface Post {
  id: string;
  author: SocialUser;
  content: string;
  media: PostMedia[];
  likes: number;
  comments: number;
  shares: number;
  reposts: number;
  createdAt: string;
  visibility: 'public' | 'followers' | 'private';
  isLiked: boolean;
  isReposted: boolean;
  isBookmarked: boolean;
  reactions: Record<ReactionType, number>;
  userReaction: ReactionType | null;
  commentList: PostComment[];
  poll?: PostPoll;
  tags: string[];
  hashtags: string[];
  mentions: string[];
}

export interface TrendingTag {
  tag: string;
  count: number;
}

export interface CreatePostOptions {
  visibility?: Post['visibility'];
  mediaUrl?: string;
  mediaAlt?: string;
  tags?: string[];
}

const currentUser: SocialUser = {
  id: 'creator-1',
  username: 'modula-builder',
  displayName: 'Modula Builder',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=modula-builder',
  bio: 'Shipping the first marketplace modules.',
  verified: true,
  followers: 0,
  following: 0,
  posts: 1,
  createdAt: new Date().toISOString(),
  isFollowing: false
};

function normalizeTag(value: string): string {
  return value.trim().replace(/^#/, '').toLowerCase();
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter((value) => value.trim().length > 0)));
}

function normalizeTags(values: string[]): string[] {
  return unique(
    values
      .map((value) => normalizeTag(value))
      .filter((value) => value.length > 0)
  );
}

function extractHashtags(content: string): string[] {
  return normalizeTags(Array.from(content.matchAll(/#([a-zA-Z0-9_]+)/g)).map((match) => match[1]));
}

function extractMentions(content: string): string[] {
  return unique(Array.from(content.matchAll(/@([a-zA-Z0-9_]+)/g)).map((match) => match[1].toLowerCase()));
}

function createReactionCounts(seed: Partial<Record<ReactionType, number>> = {}): Record<ReactionType, number> {
  return {
    like: 0,
    love: 0,
    laugh: 0,
    fire: 0,
    rocket: 0,
    celebrate: 0,
    ...seed
  };
}

function sumReactions(reactions: Record<ReactionType, number>): number {
  return Object.values(reactions).reduce((total, count) => total + count, 0);
}

interface DraftComment extends Omit<PostComment, 'tags' | 'hashtags' | 'mentions'> {
  tags?: string[];
  hashtags?: string[];
  mentions?: string[];
}

interface DraftPost extends Omit<Post, 'likes' | 'comments' | 'isLiked' | 'commentList' | 'tags' | 'hashtags' | 'reactions' | 'userReaction'> {
  commentList?: DraftComment[];
  tags?: string[];
  hashtags?: string[];
  reactions?: Partial<Record<ReactionType, number>>;
  userReaction?: ReactionType | null;
}

function hydrateComment(comment: DraftComment): PostComment {
  const hashtags = normalizeTags(comment.hashtags?.length ? comment.hashtags : extractHashtags(comment.content));
  const mentions = unique(comment.mentions?.length ? comment.mentions.map((mention) => mention.replace(/^@/, '').toLowerCase()) : extractMentions(comment.content));
  const tags = unique([...(comment.tags ?? []).map((tag) => normalizeTag(tag)).filter((tag) => tag.length > 0), ...hashtags]);

  return {
    ...comment,
    tags,
    hashtags,
    mentions
  };
}

function hydratePost(post: DraftPost): Post {
  const commentList = (post.commentList ?? []).map(hydrateComment);
  const hashtags = normalizeTags(post.hashtags?.length ? post.hashtags : extractHashtags(post.content));
  const tags = unique([...(post.tags ?? []).map((tag) => normalizeTag(tag)).filter((tag) => tag.length > 0), ...hashtags]);
  const reactions = createReactionCounts(post.reactions);
  const userReaction = post.userReaction ?? null;

  return {
    ...post,
    commentList,
    comments: commentList.length,
    reactions,
    userReaction,
    likes: sumReactions(reactions),
    isLiked: userReaction !== null,
    tags,
    hashtags
  };
}

function buildTrendingTags(posts: Post[]): TrendingTag[] {
  const scores = new Map<string, number>();

  for (const post of posts) {
    for (const tag of unique([...post.tags, ...post.hashtags])) {
      scores.set(tag, (scores.get(tag) ?? 0) + 3);
    }

    for (const comment of post.commentList) {
      for (const tag of unique([...comment.tags, ...comment.hashtags])) {
        scores.set(tag, (scores.get(tag) ?? 0) + 1);
      }
    }
  }

  const entries = Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag, count]) => ({ tag, count }));

  if (entries.length === 0) {
    return [
      { tag: 'modula', count: 1 },
      { tag: 'social', count: 1 },
      { tag: 'community', count: 1 }
    ];
  }

  return entries;
}

const mockUsers: SocialUser[] = [
  {
    id: 'user-1',
    username: 'johndoe',
    displayName: 'John Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    bio: 'Software engineer and open source enthusiast.',
    verified: true,
    followers: 1234,
    following: 567,
    posts: 89,
    createdAt: '2024-01-15T10:30:00Z',
    isFollowing: false
  },
  {
    id: 'user-2',
    username: 'janedoe',
    displayName: 'Jane Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
    bio: 'Designer, creator, and coffee addict.',
    verified: true,
    followers: 5678,
    following: 234,
    posts: 156,
    createdAt: '2023-06-20T14:45:00Z',
    isFollowing: true
  },
  {
    id: 'user-3',
    username: 'cryptoking',
    displayName: 'Crypto King',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=crypto',
    bio: 'DeFi maximalist and NFT collector.',
    verified: false,
    followers: 9876,
    following: 123,
    posts: 432,
    createdAt: '2023-03-10T08:00:00Z',
    isFollowing: false
  },
  {
    id: 'user-4',
    username: 'airesearcher',
    displayName: 'AI Researcher',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ai',
    bio: 'Building the future of composable AI.',
    verified: true,
    followers: 15000,
    following: 890,
    posts: 245,
    createdAt: '2022-11-05T16:20:00Z',
    isFollowing: true
  }
];

function generateMockPosts(): Post[] {
  const now = Date.now();
  return [
    {
      id: 'post-1',
      author: mockUsers[0],
      content: 'Just shipped a new feature for Modula. The module system is now live. What modules would you like to see next?',
      media: [],
      likes: 42,
      comments: 12,
      shares: 5,
      reposts: 3,
      createdAt: new Date(now - 1000 * 60 * 30).toISOString(),
      visibility: 'public',
      isReposted: false,
      isBookmarked: false,
      reactions: createReactionCounts({ like: 24, love: 8, laugh: 4, fire: 3, rocket: 2, celebrate: 1 }),
      userReaction: null,
      commentList: [
        {
          id: 'comment-1',
          author: mockUsers[1],
          content: 'Huge milestone. I want a native #modula board widget next.',
          createdAt: new Date(now - 1000 * 60 * 18).toISOString(),
          likes: 6,
          isLiked: false
        },
        {
          id: 'comment-2',
          author: mockUsers[3],
          content: 'Seconded. Also add hashtag filters in-feed. #product #social',
          createdAt: new Date(now - 1000 * 60 * 12).toISOString(),
          likes: 9,
          isLiked: true
        }
      ],
      tags: ['modula', 'launch', 'tech'],
      mentions: []
    },
    {
      id: 'post-2',
      author: mockUsers[1],
      content: 'Designing the new Social module UI. Here is a preview of the feed surface.',
      media: [
        {
          id: 'media-1',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200',
          altText: 'UI design preview'
        }
      ],
      likes: 156,
      comments: 34,
      shares: 12,
      reposts: 8,
      createdAt: new Date(now - 1000 * 60 * 60 * 2).toISOString(),
      visibility: 'public',
      isReposted: false,
      isBookmarked: true,
      reactions: createReactionCounts({ like: 88, love: 31, laugh: 12, fire: 14, rocket: 7, celebrate: 4 }),
      userReaction: 'love',
      commentList: [
        {
          id: 'comment-3',
          author: mockUsers[0],
          content: 'The layout spacing is super clean. #design',
          createdAt: new Date(now - 1000 * 60 * 75).toISOString(),
          likes: 3,
          isLiked: false
        },
        {
          id: 'comment-4',
          author: mockUsers[2],
          content: 'Ship it 🚀. Would love @johndoe to review this.',
          createdAt: new Date(now - 1000 * 60 * 62).toISOString(),
          likes: 2,
          isLiked: false
        }
      ],
      tags: ['design', 'ui', 'modula'],
      mentions: ['johndoe']
    },
    {
      id: 'post-3',
      author: mockUsers[2],
      content: 'What is the best part of Web3 social? Vote below.',
      media: [],
      likes: 89,
      comments: 23,
      shares: 15,
      reposts: 10,
      createdAt: new Date(now - 1000 * 60 * 60 * 5).toISOString(),
      visibility: 'public',
      isReposted: false,
      isBookmarked: false,
      reactions: createReactionCounts({ like: 41, love: 18, laugh: 11, fire: 10, rocket: 6, celebrate: 3 }),
      userReaction: null,
      commentList: [
        {
          id: 'comment-5',
          author: mockUsers[3],
          content: 'Data ownership all the way. #web3 #identity',
          createdAt: new Date(now - 1000 * 60 * 255).toISOString(),
          likes: 12,
          isLiked: true
        }
      ],
      tags: ['crypto', 'web3', 'gm'],
      mentions: [],
      poll: {
        id: 'poll-1',
        question: 'What is the best thing about Web3 social?',
        options: [
          { id: 'opt-1', text: 'Decentralization', votes: 45, percentage: 45 },
          { id: 'opt-2', text: 'Data ownership', votes: 30, percentage: 30 },
          { id: 'opt-3', text: 'Token incentives', votes: 20, percentage: 20 },
          { id: 'opt-4', text: 'Community governance', votes: 5, percentage: 5 }
        ],
        totalVotes: 100,
        endsAt: new Date(now + 1000 * 60 * 60 * 24).toISOString(),
        hasVoted: false
      }
    },
    {
      id: 'post-4',
      author: mockUsers[3],
      content: 'Composability wins. Smaller specialized models plus modular surfaces beat monolithic products every time.',
      media: [],
      likes: 234,
      comments: 56,
      shares: 45,
      reposts: 28,
      createdAt: new Date(now - 1000 * 60 * 60 * 8).toISOString(),
      visibility: 'public',
      isReposted: true,
      isBookmarked: true,
      reactions: createReactionCounts({ like: 120, love: 62, laugh: 11, fire: 22, rocket: 16, celebrate: 6 }),
      userReaction: 'fire',
      commentList: [
        {
          id: 'comment-6',
          author: mockUsers[0],
          content: 'Composable > monolithic has become obvious this year. #ai #modula',
          createdAt: new Date(now - 1000 * 60 * 470).toISOString(),
          likes: 17,
          isLiked: false
        },
        {
          id: 'comment-7',
          author: mockUsers[1],
          content: 'Agreed. Smaller surfaces win UX too. #product',
          createdAt: new Date(now - 1000 * 60 * 455).toISOString(),
          likes: 8,
          isLiked: false
        }
      ],
      tags: ['ai', 'research', 'llm'],
      mentions: []
    }
  ].map(hydratePost);
}

export const feedPosts = writable<Post[]>([]);
export const feedLoading = writable<boolean>(false);
export const feedFilter = writable<FeedFilter>('all');
export const selectedHashtag = writable<string | null>(null);
export const trendingTags = writable<TrendingTag[]>(buildTrendingTags(generateMockPosts()));
export const suggestedUsers = writable<SocialUser[]>(mockUsers.filter((user) => !user.isFollowing));

export async function loadFeed(filter?: FeedFilter): Promise<void> {
  const nextFilter = filter ?? get(feedFilter);
  const hashtag = get(selectedHashtag);
  feedFilter.set(nextFilter);
  feedLoading.set(true);

  await new Promise((resolve) => setTimeout(resolve, 220));

  const basePosts = generateMockPosts();
  trendingTags.set(buildTrendingTags(basePosts));

  let posts = [...basePosts];
  if (nextFilter === 'following') {
    posts = posts.filter((post) => post.author.isFollowing);
  } else if (nextFilter === 'trending') {
    posts = posts.sort((a, b) => b.likes + b.reposts - (a.likes + a.reposts));
  }

  if (hashtag) {
    posts = posts.filter((post) => {
      if (post.tags.includes(hashtag) || post.hashtags.includes(hashtag)) {
        return true;
      }

      return post.commentList.some((comment) => comment.tags.includes(hashtag) || comment.hashtags.includes(hashtag));
    });
  }

  feedPosts.set(posts);
  feedLoading.set(false);
}

export function setHashtagFilter(tag: string | null): void {
  if (!tag) {
    selectedHashtag.set(null);
    return;
  }

  const normalized = normalizeTag(tag);
  selectedHashtag.set(normalized.length > 0 ? normalized : null);
}

export function clearHashtagFilter(): void {
  selectedHashtag.set(null);
}

export function createPost(content: string, options: CreatePostOptions = {}): void {
  const trimmed = content.trim();
  if (!trimmed) return;
  const media = options.mediaUrl
    ? [
        {
          id: `media-${Date.now()}`,
          type: 'image' as const,
          url: options.mediaUrl,
          altText: options.mediaAlt?.trim() || undefined
        }
      ]
    : [];

  const hashtags = extractHashtags(trimmed);
  const tags = normalizeTags([...(options.tags ?? []), ...hashtags]);

  const nextPost: Post = {
    id: `post-${Date.now()}`,
    author: currentUser,
    content: trimmed,
    media,
    likes: 0,
    comments: 0,
    shares: 0,
    reposts: 0,
    createdAt: new Date().toISOString(),
    visibility: options.visibility ?? 'public',
    isLiked: false,
    isReposted: false,
    isBookmarked: false,
    reactions: createReactionCounts(),
    userReaction: null,
    commentList: [],
    tags,
    hashtags,
    mentions: extractMentions(trimmed)
  };

  feedPosts.update((posts) => {
    const nextPosts = [nextPost, ...posts];
    trendingTags.set(buildTrendingTags(nextPosts));
    return nextPosts;
  });
}

export function reactToPost(postId: string, reaction: ReactionType): void {
  feedPosts.update((posts) =>
    posts.map((post) => {
      if (post.id !== postId) {
        return post;
      }

      const reactions = { ...createReactionCounts(post.reactions) };
      const previous = post.userReaction;

      if (previous === reaction) {
        reactions[reaction] = Math.max(0, reactions[reaction] - 1);
        return {
          ...post,
          reactions,
          userReaction: null,
          likes: sumReactions(reactions),
          isLiked: false
        };
      }

      if (previous) {
        reactions[previous] = Math.max(0, reactions[previous] - 1);
      }

      reactions[reaction] += 1;
      return {
        ...post,
        reactions,
        userReaction: reaction,
        likes: sumReactions(reactions),
        isLiked: true
      };
    })
  );
}

export function likePost(postId: string): void {
  reactToPost(postId, 'like');
}

export function repostPost(postId: string): void {
  feedPosts.update((posts) =>
    posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            isReposted: !post.isReposted,
            reposts: post.reposts + (post.isReposted ? -1 : 1)
          }
        : post
    )
  );
}

export function bookmarkPost(postId: string): void {
  feedPosts.update((posts) =>
    posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            isBookmarked: !post.isBookmarked
          }
        : post
    )
  );
}

export function followUser(userId: string): void {
  suggestedUsers.update((users) =>
    users
      .map((user) =>
        user.id === userId
          ? {
              ...user,
              isFollowing: !user.isFollowing,
              followers: user.followers + (user.isFollowing ? -1 : 1)
            }
          : user
      )
      .filter((user) => !user.isFollowing)
  );

  feedPosts.update((posts) =>
    posts.map((post) =>
      post.author.id === userId
        ? {
            ...post,
            author: {
              ...post.author,
              isFollowing: !post.author.isFollowing,
              followers: post.author.followers + (post.author.isFollowing ? -1 : 1)
            }
          }
        : post
    )
  );
}

export function addComment(postId: string, content: string): void {
  const trimmed = content.trim();
  if (!trimmed) return;

  feedPosts.update((posts) => {
    const nextPosts = posts.map((post) => {
      if (post.id !== postId) {
        return post;
      }

      const hashtags = extractHashtags(trimmed);
      const comment: PostComment = {
        id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        author: currentUser,
        content: trimmed,
        createdAt: new Date().toISOString(),
        likes: 0,
        isLiked: false,
        tags: normalizeTags(hashtags),
        hashtags,
        mentions: extractMentions(trimmed)
      };

      const commentList = [...post.commentList, comment];
      return {
        ...post,
        commentList,
        comments: commentList.length
      };
    });

    trendingTags.set(buildTrendingTags(nextPosts));
    return nextPosts;
  });
}

export function toggleCommentLike(postId: string, commentId: string): void {
  feedPosts.update((posts) =>
    posts.map((post) => {
      if (post.id !== postId) {
        return post;
      }

      const commentList = post.commentList.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.likes + (comment.isLiked ? -1 : 1)
            }
          : comment
      );

      return {
        ...post,
        commentList
      };
    })
  );
}

export function votePoll(postId: string, optionId: string): void {
  feedPosts.update((posts) =>
    posts.map((post) => {
      if (post.id !== postId || !post.poll || post.poll.hasVoted) {
        return post;
      }

      const totalVotes = post.poll.totalVotes + 1;
      const options = post.poll.options.map((option) => {
        const votes = option.id === optionId ? option.votes + 1 : option.votes;
        return {
          ...option,
          votes,
          percentage: Math.round((votes / totalVotes) * 100)
        };
      });

      return {
        ...post,
        poll: {
          ...post.poll,
          totalVotes,
          hasVoted: true,
          votedOption: optionId,
          options
        }
      };
    })
  );
}
