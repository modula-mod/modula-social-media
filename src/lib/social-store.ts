import { writable, get } from 'svelte/store';

export type FeedFilter = 'all' | 'following' | 'trending';

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
  poll?: PostPoll;
  tags: string[];
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
      isLiked: false,
      isReposted: false,
      isBookmarked: false,
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
      isLiked: true,
      isReposted: false,
      isBookmarked: true,
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
      isLiked: false,
      isReposted: false,
      isBookmarked: false,
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
      isLiked: true,
      isReposted: true,
      isBookmarked: true,
      tags: ['ai', 'research', 'llm'],
      mentions: []
    }
  ];
}

export const feedPosts = writable<Post[]>([]);
export const feedLoading = writable<boolean>(false);
export const feedFilter = writable<FeedFilter>('all');
export const trendingTags = writable<TrendingTag[]>([
  { tag: 'modula', count: 1234 },
  { tag: 'web3', count: 987 },
  { tag: 'ai', count: 876 },
  { tag: 'design', count: 654 },
  { tag: 'crypto', count: 543 }
]);
export const suggestedUsers = writable<SocialUser[]>(mockUsers.filter((user) => !user.isFollowing));

export async function loadFeed(filter?: FeedFilter): Promise<void> {
  const nextFilter = filter ?? get(feedFilter);
  feedFilter.set(nextFilter);
  feedLoading.set(true);

  await new Promise((resolve) => setTimeout(resolve, 220));

  let posts = generateMockPosts();
  if (nextFilter === 'following') {
    posts = posts.filter((post) => post.author.isFollowing);
  } else if (nextFilter === 'trending') {
    posts = posts.sort((a, b) => b.likes + b.reposts - (a.likes + a.reposts));
  }

  feedPosts.set(posts);
  feedLoading.set(false);
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
  const nextPost: Post = {
    id: `post-${Date.now()}`,
    author: {
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
    },
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
    tags: Array.from(trimmed.matchAll(/#(\w+)/g)).map((match) => match[1]),
    mentions: Array.from(trimmed.matchAll(/@(\w+)/g)).map((match) => match[1])
  };

  feedPosts.update((posts) => [nextPost, ...posts]);
}

export function likePost(postId: string): void {
  feedPosts.update((posts) =>
    posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            isLiked: !post.isLiked,
            likes: post.likes + (post.isLiked ? -1 : 1)
          }
        : post
    )
  );
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
