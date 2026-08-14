"use client";

import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { postChatMessage } from "@/lib/chat/actions";
import { reportPost, blockUser } from "@/lib/moderation/actions";
import { ChatMessageRow } from "@/components/chat/ChatMessageRow";
import type { CurrentUser } from "@/lib/auth/current-user";

export interface ChatMessage {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  username: string;
}

interface RealtimePostRow {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  is_deleted: boolean;
}

export function ChatWindow({
  matchId,
  isLive,
  currentUser,
  initialMessages,
}: {
  matchId: string;
  isLive: boolean;
  currentUser: CurrentUser | null;
  initialMessages: ChatMessage[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);
  const usernameCache = useRef(new Map(initialMessages.map((m) => [m.authorId, m.username])));

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`chat:${matchId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts", filter: `match_id=eq.${matchId}` },
        async (payload) => {
          const row = payload.new as RealtimePostRow;
          if (row.is_deleted) return;

          let username = usernameCache.current.get(row.author_id);
          if (!username) {
            const { data } = await supabase
              .from("profiles")
              .select("username")
              .eq("id", row.author_id)
              .single();
            username = data?.username ?? "hincha";
            usernameCache.current.set(row.author_id, username);
          }

          setMessages((prev) =>
            prev.some((m) => m.id === row.id)
              ? prev
              : [
                  ...prev,
                  {
                    id: row.id,
                    content: row.content,
                    createdAt: row.created_at,
                    authorId: row.author_id,
                    username: username!,
                  },
                ],
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const content = input;
    startTransition(async () => {
      const result = await postChatMessage(matchId, content);
      if (result.error) setError(result.error);
      else setInput("");
    });
  }

  async function handleReport(postId: string) {
    await reportPost(postId, "contenido_inapropiado");
  }

  async function handleBlock(authorId: string) {
    const result = await blockUser(authorId);
    if (!result.error) {
      setMessages((prev) => prev.filter((m) => m.authorId !== authorId));
    }
  }

  return (
    <div className="flex flex-col rounded-2xl border border-neutral-800 bg-neutral-900">
      <div className="flex max-h-96 flex-col gap-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="py-6 text-center text-sm text-neutral-500">
            {isLive ? "Todavía nadie escribió. Arrancá vos." : "No hubo mensajes en este partido."}
          </p>
        )}
        {messages.map((message) => (
          <ChatMessageRow
            key={message.id}
            message={message}
            canModerate={Boolean(currentUser) && currentUser?.id !== message.authorId}
            onReport={handleReport}
            onBlock={handleBlock}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-neutral-800 p-3">
        {!isLive && (
          <p className="text-center text-xs text-neutral-500">
            El chat se abre cuando arranca el partido y se cierra cuando termina.
          </p>
        )}
        {isLive && !currentUser && (
          <p className="text-center text-xs text-neutral-500">
            <Link href="/login" className="font-medium text-accent-400 hover:text-accent-300">
              Iniciá sesión
            </Link>{" "}
            para escribir.
          </p>
        )}
        {isLive && currentUser && (
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={280}
              rows={1}
              placeholder="Escribí algo para la gente…"
              className="flex-1 resize-none rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-50 outline-none placeholder:text-neutral-600 focus:border-accent-500"
            />
            <button
              type="submit"
              disabled={pending || !input.trim()}
              className="shrink-0 rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-accent-400 disabled:opacity-50"
            >
              Enviar
            </button>
          </form>
        )}
        {error && <p className="mt-2 text-xs text-danger">{error}</p>}
      </div>
    </div>
  );
}
