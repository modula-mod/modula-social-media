import type {
	ModulaContext,
	SocialCommentsPayload,
	SocialContractPayload,
	SocialExplorePayload,
	SocialFeedPayload,
	SocialMutationPayload,
	SocialPostDetailPayload,
	SocialProfileMePayload,
	Visibility
} from './types';

function authHeaders(): Record<string, string> {
	if (typeof localStorage === 'undefined') return {};
	const token = localStorage.getItem('token') ?? localStorage.getItem('auth_token') ?? '';
	return token ? { authorization: `Bearer ${token}` } : {};
}

export function resolveApiBase(modula: ModulaContext | null | undefined): string {
	const apiBase = String(modula?.apiBase || '').trim();
	if (apiBase) {
		if (apiBase.endsWith('/social-media')) return apiBase;
		if (apiBase.endsWith('/modules')) return `${apiBase}/social-media`;
		if (apiBase.endsWith('/modula')) return `${apiBase}/modules/social-media`;
	}
	return '/api/modula/modules/social-media';
}

export function normalizeSurfaceId(modula: ModulaContext | null | undefined): 'feed' | 'explore' | 'profile' | 'reels' {
	const id = String(modula?.surface?.id || '').toLowerCase();
	const route = String(modula?.surface?.route || '').toLowerCase();

	if (id === 'explore' || route === '/social/explore') return 'explore';
	if (id === 'profile' || route === '/social/profile') return 'profile';
	if (id === 'reels' || route === '/social/reels') return 'reels';
	return 'feed';
}

async function request<T>(apiBase: string, path: string, init: RequestInit = {}): Promise<T> {
	const response = await fetch(`${apiBase}${path}`, {
		cache: 'no-store',
		headers: {
			...authHeaders(),
			...(init.body ? { 'Content-Type': 'application/json' } : {}),
			...(init.headers ?? {})
		},
		...init
	});

	const text = await response.text();
	if (!response.ok) {
		throw new Error(`Social API ${response.status}: ${text.slice(0, 220) || response.statusText}`);
	}

	if (!text.trim()) return {} as T;
	return JSON.parse(text) as T;
}

export function loadFeed(apiBase: string, limit = 20) {
	return request<SocialFeedPayload>(apiBase, `/feed?limit=${encodeURIComponent(String(limit))}`);
}

export function createPost(apiBase: string, body: string, visibility: Visibility = 'public') {
	return request<SocialPostDetailPayload>(apiBase, '/posts', {
		method: 'POST',
		body: JSON.stringify({ body, visibility })
	});
}

export function reactToPost(apiBase: string, postId: string, reactionType = 'like') {
	return request<SocialMutationPayload>(apiBase, `/posts/${encodeURIComponent(postId)}/reactions`, {
		method: 'POST',
		body: JSON.stringify({ reaction_type: reactionType })
	});
}

export function loadComments(apiBase: string, postId: string, limit = 100) {
	return request<SocialCommentsPayload>(
		apiBase,
		`/posts/${encodeURIComponent(postId)}/comments?limit=${encodeURIComponent(String(limit))}`
	);
}

export function createComment(apiBase: string, postId: string, body: string) {
	return request<SocialMutationPayload>(apiBase, `/posts/${encodeURIComponent(postId)}/comments`, {
		method: 'POST',
		body: JSON.stringify({ body })
	});
}

export function loadExplore(apiBase: string, limit = 10) {
	return request<SocialExplorePayload>(apiBase, `/explore?limit=${encodeURIComponent(String(limit))}`);
}

export function loadMyProfile(apiBase: string) {
	return request<SocialProfileMePayload>(apiBase, '/profile/me');
}

export function loadModuleContract(apiBase: string) {
	return request<SocialContractPayload>(apiBase, '/contracts');
}
