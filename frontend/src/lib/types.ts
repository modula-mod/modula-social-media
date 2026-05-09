export type Visibility = 'public' | 'followers' | 'private';

export type ModulaContext = {
	packageId?: string;
	version?: string;
	apiBase?: string;
	theme?: { id?: string } | string | null;
	surfaceStyle?: { id?: string } | string | null;
	runtimeRegistry?: Record<string, unknown> | null;
	surface?: {
		id?: string | null;
		route?: string | null;
		title?: string | null;
		type?: string | null;
		entry?: string | null;
		packageId?: string | null;
		packageKind?: string | null;
		parentModuleId?: string | null;
	} | null;
};

export type SocialProfile = {
	profile_id: string;
	user_id: string;
	identity_id: string;
	handle: string;
	display_name: string;
	profile_image_url?: string | null;
};

export type SocialComment = {
	comment_id: string;
	post_id: string;
	body: string;
	created_at: number;
	updated_at: number;
	author: SocialProfile;
};

export type SocialPost = {
	post_id: string;
	body: string;
	visibility: Visibility;
	created_at: number;
	updated_at: number;
	author: SocialProfile;
	reaction_count: number;
	comment_count: number;
	reactions_by_type: Record<string, number>;
	viewer_reaction?: string | null;
};

export type SocialFeedPayload = {
	generated_at: number;
	posts: SocialPost[];
};

export type SocialExplorePayload = {
	generated_at: number;
	trending_posts: SocialPost[];
	trending_topics: string[];
};

export type SocialCommentsPayload = {
	generated_at: number;
	post_id: string;
	comments: SocialComment[];
};

export type SocialMutationPayload = {
	status: string;
	post?: SocialPost;
	comment?: SocialComment;
	viewer_reaction?: string | null;
};

export type SocialPostDetailPayload = {
	post: SocialPost;
};

export type SocialProfileMePayload = {
	generated_at: number;
	profile: SocialProfile;
	post_count: number;
	follower_count: number;
	following_count: number;
};

export type SocialWidgetContract = {
	id: string;
	title: string;
	description?: string;
	surface?: string;
};

export type SocialFunctionContract = {
	id: string;
	title: string;
	permission: string;
};

export type SocialPermissionContract = {
	id: string;
	description?: string;
	risk: 'low' | 'medium' | 'high' | string;
};

export type SocialNotificationContract = {
	id: string;
	title: string;
	default_enabled: boolean;
};

export type SocialContractPayload = {
	module_id: string;
	version: string;
	widgets: SocialWidgetContract[];
	functions: SocialFunctionContract[];
	permissions: SocialPermissionContract[];
	notifications: SocialNotificationContract[];
	events: Array<{ id: string; direction: 'emitted' | 'accepted' | string }>;
};
