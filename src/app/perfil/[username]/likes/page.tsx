import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { fetchProfileByUsername, fetchProfilePosts } from "@/lib/timeline/queries";
import { ProfilePostList } from "@/components/timeline/ProfilePostList";

export default async function ProfileLikesPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const currentUser = await getCurrentUser();
  const profile = await fetchProfileByUsername(username, currentUser?.id ?? null);
  if (!profile) notFound();

  const posts = await fetchProfilePosts(profile.id, "likes", currentUser?.id ?? null);
  return <ProfilePostList posts={posts} currentUser={currentUser} emptyLabel="Todavía no le dio me gusta a ningún tuit." />;
}
