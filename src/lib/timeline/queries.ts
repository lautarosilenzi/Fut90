import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { PostAuthor, ProfileSummary, ProfileTab, TimelinePost } from "@/lib/timeline/types";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

interface RawProfileRef {
  username: string;
  display_name: string | null;
  avatar_url: string | null;
}

interface RawPostRow {
  id: string;
  content: string;
  media_urls: string[] | null;
  created_at: string;
  author_id: string;
  parent_post_id: string | null;
  profiles: RawProfileRef | RawProfileRef[] | null;
}

const POST_SELECT =
  "id, content, media_urls, created_at, author_id, parent_post_id, profiles(username, display_name, avatar_url)";

function authorOf(row: RawPostRow): PostAuthor {
  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
  return {
    id: row.author_id,
    username: profile?.username ?? "hincha",
    displayName: profile?.display_name ?? null,
    avatarUrl: profile?.avatar_url ?? null,
  };
}

function countBy(rows: { post_id: string }[] | null): Map<string, number> {
  const map = new Map<string, number>();
  for (const row of rows ?? []) map.set(row.post_id, (map.get(row.post_id) ?? 0) + 1);
  return map;
}

function replyCountBy(rows: { parent_post_id: string | null }[] | null): Map<string, number> {
  const map = new Map<string, number>();
  for (const row of rows ?? []) {
    if (!row.parent_post_id) continue;
    map.set(row.parent_post_id, (map.get(row.parent_post_id) ?? 0) + 1);
  }
  return map;
}

/** Junta filas crudas de `posts` con sus contadores (likes/reposts/respuestas) en pocas queries. */
async function hydrate(
  supabase: SupabaseServerClient,
  rows: RawPostRow[],
  viewerId: string | null,
): Promise<TimelinePost[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((row) => row.id);

  const [likeRows, repostRows, replyRows, viewerLikeRows, viewerRepostRows] = await Promise.all([
    supabase.from("likes").select("post_id").in("post_id", ids),
    supabase.from("reposts").select("post_id").in("post_id", ids),
    supabase.from("posts").select("parent_post_id").in("parent_post_id", ids).eq("is_deleted", false),
    viewerId
      ? supabase.from("likes").select("post_id").eq("user_id", viewerId).in("post_id", ids)
      : Promise.resolve({ data: [] as { post_id: string }[] }),
    viewerId
      ? supabase.from("reposts").select("post_id").eq("user_id", viewerId).in("post_id", ids)
      : Promise.resolve({ data: [] as { post_id: string }[] }),
  ]);

  const likeCounts = countBy(likeRows.data);
  const repostCounts = countBy(repostRows.data);
  const replyCounts = replyCountBy(replyRows.data);
  const likedSet = new Set((viewerLikeRows.data ?? []).map((row) => row.post_id));
  const repostedSet = new Set((viewerRepostRows.data ?? []).map((row) => row.post_id));

  return rows.map((row) => ({
    id: row.id,
    content: row.content,
    mediaUrls: row.media_urls ?? [],
    createdAt: row.created_at,
    parentPostId: row.parent_post_id,
    author: authorOf(row),
    likeCount: likeCounts.get(row.id) ?? 0,
    repostCount: repostCounts.get(row.id) ?? 0,
    replyCount: replyCounts.get(row.id) ?? 0,
    likedByViewer: likedSet.has(row.id),
    repostedByViewer: repostedSet.has(row.id),
  }));
}

export async function fetchTimelinePosts({
  viewerId,
  before,
  limit = 30,
}: {
  viewerId: string | null;
  before?: string;
  limit?: number;
}): Promise<TimelinePost[]> {
  const supabase = await createClient();
  let query = supabase
    .from("posts")
    .select(POST_SELECT)
    .is("match_id", null)
    .is("parent_post_id", null)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (before) query = query.lt("created_at", before);

  const { data } = await query;
  return hydrate(supabase, (data as RawPostRow[] | null) ?? [], viewerId);
}

export async function fetchThread(
  postId: string,
  viewerId: string | null,
): Promise<{ post: TimelinePost; replies: TimelinePost[] } | null> {
  const supabase = await createClient();
  const [{ data: postRow }, { data: replyRows }] = await Promise.all([
    supabase.from("posts").select(POST_SELECT).eq("id", postId).eq("is_deleted", false).maybeSingle(),
    supabase
      .from("posts")
      .select(POST_SELECT)
      .eq("parent_post_id", postId)
      .eq("is_deleted", false)
      .order("created_at", { ascending: true })
      .limit(100),
  ]);

  if (!postRow) return null;

  const combined = await hydrate(
    supabase,
    [postRow as RawPostRow, ...((replyRows as RawPostRow[] | null) ?? [])],
    viewerId,
  );
  const [post, ...replies] = combined;
  return { post, replies };
}

export const fetchProfileByUsername = cache(async function fetchProfileByUsername(
  username: string,
  viewerId: string | null,
): Promise<ProfileSummary | null> {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, bio, created_at")
    .eq("username", username)
    .maybeSingle();

  if (!profile) return null;

  const [{ data: followers }, { data: following }, viewerFollow] = await Promise.all([
    supabase.from("follows").select("follower_id").eq("following_id", profile.id),
    supabase.from("follows").select("following_id").eq("follower_id", profile.id),
    viewerId && viewerId !== profile.id
      ? supabase
          .from("follows")
          .select("follower_id")
          .eq("follower_id", viewerId)
          .eq("following_id", profile.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  return {
    id: profile.id,
    username: profile.username,
    displayName: profile.display_name,
    avatarUrl: profile.avatar_url,
    bio: profile.bio,
    createdAt: profile.created_at,
    followerCount: followers?.length ?? 0,
    followingCount: following?.length ?? 0,
    followedByViewer: Boolean(viewerFollow.data),
    isOwnProfile: viewerId === profile.id,
  };
});

export async function fetchProfilePosts(
  profileId: string,
  tab: ProfileTab,
  viewerId: string | null,
): Promise<TimelinePost[]> {
  const supabase = await createClient();

  if (tab === "likes") {
    const { data: likeRows } = await supabase
      .from("likes")
      .select("post_id")
      .eq("user_id", profileId)
      .order("created_at", { ascending: false })
      .limit(50);
    const ids = (likeRows ?? []).map((row) => row.post_id);
    if (ids.length === 0) return [];

    const { data } = await supabase.from("posts").select(POST_SELECT).in("id", ids).eq("is_deleted", false);
    const order = new Map(ids.map((id, index) => [id, index]));
    const rows = ((data as RawPostRow[] | null) ?? []).sort(
      (a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0),
    );
    return hydrate(supabase, rows, viewerId);
  }

  if (tab === "media") {
    const { data } = await supabase
      .from("posts")
      .select(POST_SELECT)
      .eq("author_id", profileId)
      .eq("is_deleted", false)
      .is("match_id", null)
      .order("created_at", { ascending: false })
      .limit(200);
    const rows = ((data as RawPostRow[] | null) ?? [])
      .filter((row) => (row.media_urls?.length ?? 0) > 0)
      .slice(0, 50);
    return hydrate(supabase, rows, viewerId);
  }

  let query = supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("author_id", profileId)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })
    .limit(50);

  query =
    tab === "respuestas"
      ? query.not("parent_post_id", "is", null)
      : query.is("parent_post_id", null).is("match_id", null);

  const { data } = await query;
  return hydrate(supabase, (data as RawPostRow[] | null) ?? [], viewerId);
}
