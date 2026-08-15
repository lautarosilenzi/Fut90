import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ProfileHeader } from "@/components/timeline/ProfileHeader";
import { ProfileTabs } from "@/components/timeline/ProfileTabs";
import { getCurrentUser } from "@/lib/auth/current-user";
import { fetchProfileByUsername } from "@/lib/timeline/queries";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  return { title: `@${username}` };
}

export default async function ProfileLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ username: string }>;
}) {
  if (!isSupabaseConfigured) notFound();

  const { username } = await params;
  const currentUser = await getCurrentUser();
  const profile = await fetchProfileByUsername(username, currentUser?.id ?? null);
  if (!profile) notFound();

  return (
    <div className="flex flex-col gap-4">
      <ProfileHeader profile={profile} viewerLoggedIn={Boolean(currentUser)} />
      <ProfileTabs username={username} />
      <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">{children}</div>
    </div>
  );
}
