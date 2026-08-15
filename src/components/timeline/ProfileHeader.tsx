import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { FollowButton } from "@/components/timeline/FollowButton";
import { EditProfileForm } from "@/components/timeline/EditProfileForm";
import { joinedDate } from "@/lib/timeline/format";
import type { ProfileSummary } from "@/lib/timeline/types";

export function ProfileHeader({
  profile,
  viewerLoggedIn,
}: {
  profile: ProfileSummary;
  viewerLoggedIn: boolean;
}) {
  const displayName = profile.displayName || profile.username;

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
      <div className="h-24 bg-gradient-to-r from-brand-800 to-brand-600" />
      <div className="px-4 pb-4">
        <div className="-mt-8 flex items-end justify-between">
          <div className="rounded-full border-4 border-neutral-900 bg-neutral-900">
            <Avatar name={profile.username} avatarUrl={profile.avatarUrl} size="lg" />
          </div>
          {profile.isOwnProfile ? (
            <EditProfileForm profile={profile} />
          ) : viewerLoggedIn ? (
            <FollowButton userId={profile.id} initialFollowing={profile.followedByViewer} />
          ) : (
            <Button href="/login" variant="secondary" size="sm">
              Seguir
            </Button>
          )}
        </div>

        <div className="mt-2">
          <h1 className="font-display text-xl tracking-wide text-neutral-50">{displayName}</h1>
          <p className="text-sm text-neutral-500">@{profile.username}</p>
        </div>

        {profile.bio && <p className="mt-2 text-sm text-neutral-200">{profile.bio}</p>}

        <p className="mt-2 text-xs text-neutral-500">Se unió en {joinedDate(profile.createdAt)}</p>

        <div className="mt-2 flex gap-4 text-sm">
          <span className="text-neutral-300">
            <span className="font-semibold text-neutral-50">{profile.followingCount}</span>{" "}
            <span className="text-neutral-500">Seguidos</span>
          </span>
          <span className="text-neutral-300">
            <span className="font-semibold text-neutral-50">{profile.followerCount}</span>{" "}
            <span className="text-neutral-500">Seguidores</span>
          </span>
        </div>
      </div>
    </div>
  );
}
