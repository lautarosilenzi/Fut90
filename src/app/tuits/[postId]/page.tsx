import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ThreadView } from "@/components/timeline/ThreadView";
import { getCurrentUser } from "@/lib/auth/current-user";
import { fetchThread } from "@/lib/timeline/queries";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Tuit" };

export default async function TuitDetailPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  if (!isSupabaseConfigured) notFound();

  const { postId } = await params;
  const currentUser = await getCurrentUser();
  const thread = await fetchThread(postId, currentUser?.id ?? null);
  if (!thread) notFound();

  return (
    <div className="flex flex-col gap-4">
      <SectionHeading title="Tuit" />
      <ThreadView post={thread.post} initialReplies={thread.replies} currentUser={currentUser} />
    </div>
  );
}
