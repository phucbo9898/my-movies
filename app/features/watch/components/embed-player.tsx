"use client";

import { cn } from "@/lib/utils";

export interface EmbedPlayerProps {
  sourceUrl?: string;
  src?: string;
  url?: string;
  title?: string;
  className?: string;
  allow?: string;
  loading?: "lazy" | "eager";
}

export function EmbedPlayer({
  sourceUrl,
  src,
  url,
  title = "Embedded player",
  className,
  allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen",
  loading = "lazy",
}: EmbedPlayerProps) {
  const resolvedSourceUrl = sourceUrl ?? src ?? url;

  if (!resolvedSourceUrl) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black",
        "aspect-video",
        className,
      )}
    >
      <iframe
        src={resolvedSourceUrl}
        title={title}
        className="absolute inset-0 h-full w-full border-0"
        allow={allow}
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        loading={loading}
      />
    </div>
  );
}

export default EmbedPlayer;
