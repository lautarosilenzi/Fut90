"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { PostComposer } from "@/components/timeline/PostComposer";
import { PostCard } from "@/components/timeline/PostCard";
import { loadMoreTimelinePosts } from "@/lib/timeline/actions";
import type { PostAuthor, TimelinePost } from "@/lib/timeline/types";
import type { CurrentUser } from "@/lib/auth/current-user";

interface RealtimePostRow {
  id: string;
  content: string;
  media_urls: string[] | null;
  created_at: string;
  author_id: string;
  match_id: string | null;
  parent_post_id: string | null;
  is_deleted: boolean;
}

export function TimelineList({
  currentUser,
  initialPosts,
}: {
  currentUser: CurrentUser | null;
  initialPosts: TimelinePost[];
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length >= 30);
  const authorCache = useRef(new Map(initialPosts.map((p) => [p.author.id, p.author])));

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("timeline:public")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        async (payload) => {
          const row = payload.new as RealtimePostRow;
          if (row.is_deleted || row.match_id || row.parent_post_id) return;
          if (currentUser && row.author_id === currentUser.id) return;

          let author = authorCache.current.get(row.author_id);
          if (!author) {
            const { data } = await supabase
              .from("profiles")
              .select("username, display_name, avatar_url")
              .eq("id", row.author_id)
              .single();
            author = {
              id: row.author_id,
              username: data?.username ?? "hincha",
              displayName: data?.display_name ?? null,
              avatarUrl: data?.avatar_url ?? null,
            } satisfies PostAuthor;
            authorCache.current.set(row.author_id, author);
          }

          const resolvedAuthor = author;
          setPosts((prev) =>
            prev.some((p) => p.id === row.id)
              ? prev
              : [
                  {
                    id: row.id,
                    content: row.content,
                    mediaUrls: row.media_urls ?? [],
                    createdAt: row.created_at,
                    parentPostId: row.parent_post_id,
                    author: resolvedAuthor,
                    likeCount: 0,
                    repostCount: 0,
                    replyCount: 0,
                    likedByViewer: false,
                    repostedByViewer: false,
                  },
                  ...prev,
                ],
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  function handlePosted(post: TimelinePost) {
    authorCache.current.set(post.author.id, post.author);
    setPosts((prev) => [post, ...prev]);
  }

  function handleDeleted(postId: string) {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }

  async function handleLoadMore() {
    const last = posts[posts.length - 1];
    if (!last) return;
    setLoadingMore(true);
    const more = await loadMoreTimelinePosts(last.createdAt);
    setPosts((prev) => [...prev, ...more]);
    setHasMore(more.length >= 20);
    setLoadingMore(false);
  }

  return (
    <div className="flex flex-col">
      {currentUser ? (
        <PostComposer currentUser={currentUser} onPosted={handlePosted} />
      ) : (
        <div className="border-b border-neutral-800 p-4 text-center text-sm text-neutral-400">
          <Link href="/login" className="font-medium text-accent-400 hover:text-accent-300">
            Iniciá sesión
          </Link>{" "}
          para tuitear.
        </div>
      )}

      {posts.length === 0 && (
        <p className="py-16 text-center text-sm text-neutral-500">Todavía no hay tuits. ¡Escribí el primero!</p>
      )}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} currentUser={currentUser} onDeleted={handleDeleted} />
      ))}

      {hasMore && posts.length > 0 && (
        <button
          type="button"
          onClick={handleLoadMore}
          disabled={loadingMore}
          className="border-b border-neutral-800 p-4 text-center text-sm font-medium text-accent-400 hover:bg-neutral-900 disabled:opacity-50"
        >
          {loadingMore ? "Cargando…" : "Cargar más"}
        </button>
      )}
    </div>
  );
}
