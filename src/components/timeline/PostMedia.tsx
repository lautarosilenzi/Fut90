"use client";

import Image from "next/image";
import { useState } from "react";

function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url);
}

export function PostMedia({ urls }: { urls: string[] }) {
  if (urls.length === 0) return null;

  const gridClass = urls.length === 1 ? "grid-cols-1" : "grid-cols-2";

  return (
    <div className={`mt-2 grid gap-0.5 overflow-hidden rounded-2xl border border-neutral-800 ${gridClass}`}>
      {urls.map((url, index) => (
        <MediaItem key={url} url={url} tall={urls.length === 3 && index === 0} />
      ))}
    </div>
  );
}

function MediaItem({ url, tall }: { url: string; tall: boolean }) {
  const [errored, setErrored] = useState(false);

  if (isVideoUrl(url)) {
    return (
      <video
        src={url}
        controls
        className={`w-full bg-neutral-950 ${tall ? "row-span-2 h-full object-cover" : "aspect-video object-cover"}`}
      />
    );
  }

  if (errored) return null;

  return (
    <div className={`relative w-full bg-neutral-900 ${tall ? "row-span-2 h-full" : "aspect-square"}`}>
      <Image
        src={url}
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, 640px"
        className="object-cover"
        onError={() => setErrored(true)}
      />
    </div>
  );
}
