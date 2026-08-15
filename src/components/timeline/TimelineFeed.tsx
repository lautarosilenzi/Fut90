import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getCurrentUser } from "@/lib/auth/current-user";
import { fetchTimelinePosts } from "@/lib/timeline/queries";
import { TimelineList } from "@/components/timeline/TimelineList";

export async function TimelineFeed() {
  if (!isSupabaseConfigured) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-700 bg-neutral-900/50 p-6 text-center text-sm text-neutral-500">
        Los tuits todavía no están conectados a una base de datos (falta configurar Supabase — ver README).
      </div>
    );
  }

  const currentUser = await getCurrentUser();
  const posts = await fetchTimelinePosts({ viewerId: currentUser?.id ?? null });

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
      <TimelineList currentUser={currentUser} initialPosts={posts} />
    </div>
  );
}
