"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import type { ChatMessage } from "@/components/chat/ChatWindow";

const timeFormatter = new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit" });

export function ChatMessageRow({
  message,
  canModerate,
  onReport,
  onBlock,
}: {
  message: ChatMessage;
  canModerate: boolean;
  onReport: (postId: string) => Promise<void>;
  onBlock: (authorId: string) => Promise<void>;
}) {
  const [reported, setReported] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleReport() {
    setBusy(true);
    await onReport(message.id);
    setReported(true);
    setBusy(false);
  }

  async function handleBlock() {
    if (!confirm(`¿Bloquear a @${message.username}? No vas a ver más sus mensajes.`)) return;
    setBusy(true);
    await onBlock(message.authorId);
  }

  return (
    <div className="flex items-start gap-2">
      <Avatar name={message.username} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="truncate text-sm font-semibold text-neutral-100">
            @{message.username}
          </span>
          <span className="text-[11px] text-neutral-500">
            {timeFormatter.format(new Date(message.createdAt))}
          </span>
        </div>
        <p className="break-words text-sm text-neutral-200">{message.content}</p>
        {canModerate && (
          <div className="mt-1 flex gap-3 text-[11px] text-neutral-600">
            <button
              type="button"
              onClick={handleReport}
              disabled={busy || reported}
              className="hover:text-neutral-400 disabled:hover:text-neutral-600"
            >
              {reported ? "Reportado" : "Reportar"}
            </button>
            <button type="button" onClick={handleBlock} disabled={busy} className="hover:text-neutral-400">
              Bloquear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
