import { MovieDetail } from "@/app/types/movie-detail";
import { PlayerSwitcher } from "@/app/features/watch/components/player-switcher";
import type { Episode, ServerData } from "@/app/types/movie";
import type { PlayerSource } from "@/app/types/player-source";

interface SelectedPlayback {
  episode: Episode;
  server: ServerData;
  source: PlayerSource;
}

interface WatchWrapperProps {
  moviePromise: Promise<MovieDetail | null>;
  nguoncEpisodesPromise: Promise<Episode[]>;
  episodeQuery?: string | undefined;
  providerQuery?: string | undefined;
  serverQuery?: string | undefined;
}

const normalizeProvider = (
  value: string | undefined,
): PlayerSource["provider"] | undefined => {
  if (!value) return undefined;
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
): { episode?: Episode; requestedServer?: string } => {
  if (!episodeQuery) return {};
  const normalizedQuery = episodeQuery.trim();
  const episode = episodes.find((ep) =>
    ep.server_data.some(
      (server) =>
        server.slug === normalizedQuery || server.name === normalizedQuery,
    ),
  );
  if (episode) {
    const requestedServer = episode.server_data.find(
      (server) =>
        server.slug === normalizedQuery || server.name === normalizedQuery,
    );
    return { episode, requestedServer: requestedServer?.slug };
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
  if (!playableServers.length) return null;

  if (serverQuery) {
    const requestedServer = playableServers.find(
      (server) => server.slug === serverQuery || server.name === serverQuery,
    );
    if (requestedServer) {
      const requestedSource = provider
        ? requestedServer.sources.find((s) => s.provider === provider)
        : requestedServer.sources[0];
      if (requestedSource)
        return { episode, server: requestedServer, source: requestedSource };
    }
  }

  const preferredServer = provider
    ? playableServers.find((server) =>
        server.sources.some((s) => s.provider === provider),
      )
    : playableServers[0];
  const server = preferredServer ?? playableServers[0];
  if (!server) return null;
  const preferredSource = provider
    ? server.sources.find((s) => s.provider === provider)
    : server.sources[0];
  const source = preferredSource ?? server.sources[0];
  if (!source) return null;
  return { episode, server, source };
};

export default async function WatchWrapper({
  moviePromise,
  nguoncEpisodesPromise,
  episodeQuery,
  providerQuery,
  serverQuery,
}: WatchWrapperProps) {
  const movie = await moviePromise;
  const nguoncEpisodes = await nguoncEpisodesPromise;
  if (!movie) return null;

  const provider = normalizeProvider(providerQuery);
  const movieForPlayback =
    provider === "nguonc" ? { ...movie, episodes: nguoncEpisodes } : movie;

  const { episode: requestedEpisode, requestedServer } = findEpisodeByQuery(
    movieForPlayback.episodes,
    episodeQuery,
  );
  const candidateEpisodes = requestedEpisode
    ? [
        requestedEpisode,
        ...movieForPlayback.episodes.filter((e) => e !== requestedEpisode),
      ]
    : movieForPlayback.episodes;

  const playable =
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
      .find((v): v is SelectedPlayback => v !== null) ?? null;

  return (
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
            {movie.content && (
              <div
                className="mt-2 text-sm text-zinc-300 sm:block border border-white/20 inline-block px-2 py-1 rounded"
                dangerouslySetInnerHTML={{ __html: movie.content }}
              />
            )}
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
  );
}
