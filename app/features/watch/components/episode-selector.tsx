"use client";

import Link from "next/link";

import type { Episode } from "@/app/types/movie";
import { cn } from "@/lib/utils";

export interface EpisodeSelectorProps {
  episodes: Episode[];
  movieSlug: string;
  activeEpisodeSlug?: string;
  defaultActiveEpisodeSlug?: string;
  onSelect?: (episode: Episode) => void;
  className?: string;
  title?: string;
}

export function EpisodeSelector({
  episodes,
  movieSlug,
  activeEpisodeSlug,
  defaultActiveEpisodeSlug,
  onSelect,
  className,
  title = "Episodes",
}: EpisodeSelectorProps) {
  const currentActiveSlug =
    activeEpisodeSlug ??
    defaultActiveEpisodeSlug ??
    episodes[0]?.server_data[0]?.slug ??
    "";

  const activeEpisode =
    episodes.find((episode) =>
      episode.server_data.some(
        (server) =>
          server.slug === currentActiveSlug ||
          server.name === currentActiveSlug,
      ),
    ) ??
    episodes[0] ??
    null;

  if (!episodes.length) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-white/10 bg-zinc-950/80 p-4 text-sm text-zinc-300",
          className,
        )}
      >
        <p className="font-semibold text-white">{title}</p>
        <p className="mt-2">No episodes are available right now.</p>
      </div>
    );
  }

  return (
    <section
      className={cn(
        "rounded-2xl border border-white/10 bg-zinc-950/80 p-4 sm:p-5",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-300">
            {title}
          </p>
          <p className="mt-2 text-sm text-zinc-300">
            {episodes.length} available
          </p>
        </div>

        {activeEpisode ? (
          <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {activeEpisode.server_name}
          </span>
        ) : null}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {episodes.map((episode) => {
          const isActive = episode.slug === activeEpisode?.slug;

          return (
            <Link
              key={`${episode.server_name}-${episode.slug}`}
              href={`/watch/${movieSlug}?episode=${encodeURIComponent(
                episode.server_data[0]?.slug ?? episode.slug,
              )}`}
              onClick={() => onSelect?.(episode)}
              className={cn(
                "rounded-xl border px-3 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-primary/60",
                isActive
                  ? "border-primary bg-primary text-zinc-950 shadow-[0_0_0_1px_rgba(244,114,182,0.35)]"
                  : "border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/10",
              )}
            >
              <p className="text-sm font-semibold">{episode.server_name}</p>
              <p
                className={cn(
                  "mt-1 text-xs",
                  isActive ? "text-zinc-900/80" : "text-zinc-300",
                )}
              >
                {episode.slug}
              </p>
              <p
                className={cn(
                  "mt-2 text-[11px] font-medium uppercase tracking-[0.2em]",
                  isActive ? "text-zinc-900/75" : "text-zinc-400",
                )}
              >
                {episode.server_data.length} source
                {episode.server_data.length === 1 ? "" : "s"}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default EpisodeSelector;
