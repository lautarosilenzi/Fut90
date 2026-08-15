import { PostCard } from "@/components/timeline/PostCard";
import type { TimelinePost } from "@/lib/timeline/types";
import type { CurrentUser } from "@/lib/auth/current-user";

export function ProfilePostList({
  posts,
  currentUser,
  emptyLabel,
}: {
  posts: TimelinePost[];
  currentUser: CurrentUser | null;
  emptyLabel: string;
}) {
  if (posts.length === 0) {
    return <p className="py-16 text-center text-sm text-neutral-500">{emptyLabel}</p>;
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} currentUser={currentUser} />
      ))}
    </div>
  );
}
