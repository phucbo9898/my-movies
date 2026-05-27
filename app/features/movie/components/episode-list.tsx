"use client";

import Link from "next/link";

import type { Episode } from "@/app/types/movie";

interface EpisodeListProps {
  episodes: Episode[];
  movieSlug: string;
  selectedSlug?: string;
}

export function EpisodeList({
  episodes,
  movieSlug,
  selectedSlug,
}: EpisodeListProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">Episodes</h2>
          <p className="mt-1 text-sm text-zinc-400">
            {episodes.length} available
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {episodes.map((episode, episodeIndex) => {
          const isActive =
            selectedSlug === episode.slug ||
            selectedSlug === String(episodeIndex) ||
            episode.server_data.some(
              (server) =>
                server.slug === selectedSlug || server.name === selectedSlug,
            );

          return (
            <div
              key={`${episode.server_name}-${episode.slug}-${episodeIndex}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <p className="text-sm font-semibold text-white">
                {episode.server_name}
              </p>
              <p className="mt-1 text-sm text-zinc-300">{episode.slug}</p>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {episode.server_data.map((server) => {
                  const href = `/watch/${encodeURIComponent(movieSlug)}?episode=${encodeURIComponent(
                    server.slug,
                  )}`;

                  return (
                    <Link
                      key={`${server.slug}-${server.filename}`}
                      href={href}
                      className={`rounded-xl border px-3 py-2 text-left transition ${
                        isActive
                          ? "border-primary bg-primary text-zinc-950"
                          : "border-white/10 bg-zinc-950/60 text-white hover:border-white/20 hover:bg-zinc-900"
                      }`}
                    >
                      <p className="text-sm font-medium">{server.name}</p>
                      <p
                        className={`mt-1 truncate text-xs ${
                          isActive ? "text-zinc-900/80" : "text-zinc-400"
                        }`}
                      >
                        {server.filename}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
