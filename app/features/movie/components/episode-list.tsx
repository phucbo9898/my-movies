"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { Episode } from "@/app/types/movie";
import type { ServerData } from "@/app/types/movie";
import { getNguonCEpisodes } from "@/app/services/movie-nguonc-api";

interface EpisodeListProps {
  episodes: Episode[];
  movieSlug: string;
  selectedSlug?: string;
  movieStatus?: string;
}

export function EpisodeList({
  episodes,
  movieSlug,
  selectedSlug,
  movieStatus,
}: EpisodeListProps) {
  const [activeTab, setActiveTab] = useState<"ophim" | "nguonc">("ophim");
  const [nguoncEpisodes, setNguoncEpisodes] = useState<Episode[]>([]);
  const [hasFetchedNguonc, setHasFetchedNguonc] = useState(false);

  const normalizeEpisodeName = (name: string): string => {
    const value = name.trim();

    // Only number
    if (/^\d+$/.test(value)) {
      return `Tập ${parseInt(value)}`;
    }

    // Episode 1 -> Tập 1
    const episodeMatch = value.match(/^episode\s+(\d+)$/i);
    if (episodeMatch) {
      return `Tập ${episodeMatch[1]}`;
    }

    return value;
  };

  useEffect(() => {
    if (activeTab !== "nguonc") return;

    let mounted = true;
    getNguonCEpisodes(movieSlug)
      .then((list) => {
        if (mounted) {
          setNguoncEpisodes(list);
          setHasFetchedNguonc(true);
        }
      })
      .catch(() => {
        if (mounted) {
          setNguoncEpisodes([]);
          setHasFetchedNguonc(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, [activeTab, movieSlug]);

  const renderServerButton = (server: ServerData, isActive: boolean) => {
    const href = `/watch/${encodeURIComponent(movieSlug)}?episode=${encodeURIComponent(
      server.slug,
    )}`;

    return (
      <Link
        key={`${server.slug}-${server.filename}`}
        href={href}
        className={`rounded-xl border px-3 py-2 text-center transition ${
          isActive
            ? "border-primary bg-primary text-white"
            : "border-white/10 bg-zinc-950/60 text-white hover:border-white/20 hover:bg-zinc-900"
        }`}
      >
        <p className="text-sm font-medium">
          {normalizeEpisodeName(`${server.name}`)}
        </p>
        {/* <p
          className={`mt-1 truncate text-xs ${isActive ? "text-zinc-900/80" : "text-zinc-400"}`}
        >
          {server.filename}
        </p> */}
      </Link>
    );
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">Episodes</h2>
          <p className="mt-1 text-sm text-zinc-400">
            {episodes.length} available
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("ophim")}
            className={`rounded-md px-3 py-1 text-sm font-medium transition ${
              activeTab === "ophim"
                ? "bg-primary text-white"
                : "bg-zinc-500 text-white hover:bg-zinc-700"
            }`}
          >
            OPhim
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("nguonc")}
            className={`rounded-md px-3 py-1 text-sm font-medium transition ${
              activeTab === "nguonc"
                ? "bg-primary text-white"
                : "bg-zinc-500 text-white hover:bg-zinc-700"
            }`}
          >
            NguonC
          </button>
        </div>
      </div>

      {activeTab === "ophim" && (
        <div className="gap-3">
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
                <p className="text-sm font-semibold">{episode.server_name}</p>
                <p className="mt-1 text-sm text-zinc-300">{episode.slug}</p>

                <div className="mt-3 gap-2 grid grid-cols-3 sm:grid-cols-8">
                  {episode.server_data.map((server) =>
                    renderServerButton(server, isActive),
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "nguonc" && (
        <div>
          {!hasFetchedNguonc ? (
            <p className="text-sm text-zinc-400">Loading NguonC sources…</p>
          ) : nguoncEpisodes.length === 0 ? (
            <p className="text-sm text-zinc-400">
              No NguonC sources available.
            </p>
          ) : (
            <div className="gap-3">
              {nguoncEpisodes.map((episode, idx) => (
                <div
                  key={`${episode.server_name}-${episode.slug}-${idx}`}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-sm font-semibold">{episode.server_name}</p>
                  <p className="mt-1 text-sm text-zinc-300">{episode.slug}</p>

                  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-8">
                    {episode.server_data.map((server) => {
                      const embed =
                        server.link_embed || server.sources?.[0]?.url || "";
                      if (!embed) {
                        return null;
                      }

                      const href = `/watch/${encodeURIComponent(
                        movieSlug,
                      )}?episode=${encodeURIComponent(
                        server.slug,
                      )}&provider=nguonc`;

                      return (
                        <Link
                          key={`${server.slug}-${server.filename}`}
                          href={href}
                          className="rounded-xl border px-3 py-2 text-center transition border-white/10 bg-zinc-950/60 text-white hover:border-white/20 hover:bg-zinc-900"
                        >
                          <p className="text-sm font-medium">
                            {normalizeEpisodeName(server.name)}
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
