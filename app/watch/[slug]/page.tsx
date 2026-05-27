import { notFound } from "next/navigation";

import { PlayerSwitcher } from "@/app/features/watch/components/player-switcher";
import { getGenres, getMovieDetail } from "@/app/services/movie-ophim-api";
import type { PlayerSource } from "@/app/types/player-source";
import type { Episode, ServerData } from "@/app/types/movie";
import MainLayout from "@/app/shared/components/layout/main-layout";

interface WatchPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

interface SelectedPlayback {
  episode: Episode;
  server: ServerData;
  source: PlayerSource;
}

const parseQueryValue = (
  value: string | string[] | undefined,
): string | undefined => {
  if (Array.isArray(value)) {
    return value[0]?.trim() || undefined;
  }

  return value?.trim() || undefined;
};

const normalizeProvider = (
  value: string | undefined,
): PlayerSource["provider"] | undefined => {
  if (!value) {
    return undefined;
  }

  switch (value.toLowerCase()) {
    case "ophim":
    case "hls":
      return "ophim";
    case "nguonc":
    case "embed":
      return "nguonc";
    default:
      return undefined;
  }
};

const findEpisodeByQuery = (
  episodes: Episode[],
  episodeQuery: string | undefined,
): {
  episode?: Episode;
  requestedServer?: string;
} => {
  if (!episodeQuery) {
    return {};
  }

  const normalizedQuery = episodeQuery.trim();

  const episode = episodes.find((episode) =>
    episode.server_data.some(
      (server) =>
        server.slug === normalizedQuery || server.name === normalizedQuery,
    ),
  );

  if (episode) {
    const requestedServer = episode.server_data.find(
      (server) =>
        server.slug === normalizedQuery || server.name === normalizedQuery,
    );

    return {
      episode,
      requestedServer: requestedServer?.slug,
    };
  }

  const index = Number(normalizedQuery);
  if (Number.isInteger(index) && index >= 0 && index < episodes.length) {
    return { episode: episodes[index] };
  }

  return {};
};

const selectPlayableSource = (
  episode: Episode,
  provider?: PlayerSource["provider"],
  serverQuery?: string,
): SelectedPlayback | null => {
  const playableServers = episode.server_data.filter(
    (server) => server.sources.length > 0,
  );

  if (!playableServers.length) {
    return null;
  }

  if (serverQuery) {
    const requestedServer = playableServers.find(
      (server) => server.slug === serverQuery || server.name === serverQuery,
    );

    if (requestedServer) {
      const requestedSource = provider
        ? requestedServer.sources.find((source) => source.provider === provider)
        : requestedServer.sources[0];

      if (requestedSource) {
        return {
          episode,
          server: requestedServer,
          source: requestedSource,
        };
      }
    }
  }

  const preferredServer = provider
    ? playableServers.find((server) =>
        server.sources.some((source) => source.provider === provider),
      )
    : playableServers[0];

  const server = preferredServer ?? playableServers[0];
  if (!server) {
    return null;
  }

  const preferredSource = provider
    ? server.sources.find((source) => source.provider === provider)
    : server.sources[0];

  const source = preferredSource ?? server.sources[0];

  if (!source) {
    return null;
  }

  return {
    episode,
    server,
    source,
  };
};

const getSelectedPlayback = (
  movie: Awaited<ReturnType<typeof getMovieDetail>>,
  episodeQuery: string | undefined,
  providerQuery: string | undefined,
  serverQuery: string | undefined,
): SelectedPlayback | null => {
  if (!movie) {
    return null;
  }

  const provider = normalizeProvider(providerQuery);
  const { episode: requestedEpisode, requestedServer } = findEpisodeByQuery(
    movie.episodes,
    episodeQuery,
  );
  const candidateEpisodes = requestedEpisode
    ? [
        requestedEpisode,
        ...movie.episodes.filter((episode) => episode !== requestedEpisode),
      ]
    : movie.episodes;

  return (
    candidateEpisodes
      .map((episode) =>
        selectPlayableSource(
          episode,
          provider,
          episode === requestedEpisode
            ? (requestedServer ?? serverQuery)
            : undefined,
        ),
      )
      .find((value): value is SelectedPlayback => value !== null) ?? null
  );
};

export default async function WatchPage({
  params,
  searchParams,
}: WatchPageProps) {
  const { slug } = await params;
  const query = (await searchParams) ?? {};

  const [movie, genres] = await Promise.all([
    getMovieDetail(slug),
    getGenres(),
  ]);

  if (!movie) {
    notFound();
  }

  const playable = getSelectedPlayback(
    movie,
    parseQueryValue(query.episode),
    parseQueryValue(query.provider),
    parseQueryValue(query.server),
  );

  return (
    <MainLayout genres={genres}>
      <main className="space-y-8 pb-12 pt-6">
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,1fr)]">
          <div className="rounded-[28px] border border-white/10 bg-zinc-950/85 p-3 sm:p-4">
            <PlayerSwitcher
              sources={playable ? [playable.source] : []}
              title={
                playable
                  ? `${movie.name} • ${playable.episode.server_name}`
                  : movie.name
              }
              description={
                playable
                  ? `${playable.server.name} • ${playable.server.filename}`
                  : "No playable source is available for this movie yet."
              }
              placeholder={movie.poster_url || movie.thumb_url}
              className="h-full"
            />
          </div>

          <aside className="rounded-[28px] border border-white/10 bg-white/3 p-5 sm:p-6">
            <div className="space-y-5">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.28em] text-zinc-300">
                  Now watching
                </p>
                <div className="space-y-2">
                  <h1 className="text-2xl font-semibold text-white sm:text-3xl">
                    {movie.name}
                  </h1>
                  <p className="text-sm text-zinc-300 sm:text-base">
                    {movie.origin_name}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-sm text-zinc-100">
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">
                  {movie.quality || "HD"}
                </span>
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">
                  {movie.lang || "Unknown"}
                </span>
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">
                  {movie.type}
                </span>
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">
                  {movie.episode_current}/{movie.episode_total}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                    Status
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {movie.status}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                    Year
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {movie.year || "—"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-200">
                  Synopsis
                </h2>
                <p className="leading-7 text-zinc-100/95">
                  {movie.content || "No overview available."}
                </p>
              </div>

              {playable ? (
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3">
                  <p className="text-sm font-semibold text-emerald-100">
                    Selected source
                  </p>
                  <p className="mt-1 text-sm text-emerald-50/90">
                    {playable.episode.server_name} • {playable.server.name} •{" "}
                    {playable.server.filename}
                  </p>
                </div>
              ) : null}
            </div>
          </aside>
        </section>
      </main>
    </MainLayout>
  );
}
