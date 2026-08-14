import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { ChatWindow, type ChatMessage } from "@/components/chat/ChatWindow";
import type { Match } from "@/lib/football-data";

interface RawPostRow {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  profiles: { username: string } | { username: string }[] | null;
}

function authorUsername(profiles: RawPostRow["profiles"]): string {
  if (!profiles) return "hincha";
  return Array.isArray(profiles) ? (profiles[0]?.username ?? "hincha") : profiles.username;
}

export async function ChatSection({ match }: { match: Match }) {
  if (!isSupabaseConfigured) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-700 bg-neutral-900/50 p-6 text-center text-sm text-neutral-500">
        El chat todavía no está conectado a una base de datos (falta configurar Supabase — ver
        README).
      </div>
    );
  }

  const supabase = await createClient();
  const [currentUser, { data }] = await Promise.all([
    getCurrentUser(),
    supabase
      .from("posts")
      .select("id, content, created_at, author_id, profiles(username)")
      .eq("match_id", match.id)
      .eq("is_deleted", false)
      .order("created_at", { ascending: true })
      .limit(200),
  ]);

  const initialMessages: ChatMessage[] = ((data as RawPostRow[] | null) ?? []).map((row) => ({
    id: row.id,
    content: row.content,
    createdAt: row.created_at,
    authorId: row.author_id,
    username: authorUsername(row.profiles),
  }));

  return (
    <ChatWindow
      matchId={match.id}
      isLive={match.status === "live"}
      currentUser={currentUser}
      initialMessages={initialMessages}
    />
  );
}
