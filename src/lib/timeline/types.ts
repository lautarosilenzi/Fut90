export interface PostAuthor {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

export interface TimelinePost {
  id: string;
  content: string;
  mediaUrls: string[];
  createdAt: string;
  parentPostId: string | null;
  author: PostAuthor;
  likeCount: number;
  repostCount: number;
  replyCount: number;
  likedByViewer: boolean;
  repostedByViewer: boolean;
}

export interface ProfileSummary {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
  followerCount: number;
  followingCount: number;
  followedByViewer: boolean;
  isOwnProfile: boolean;
}

export type ProfileTab = "tuits" | "respuestas" | "media" | "likes";
