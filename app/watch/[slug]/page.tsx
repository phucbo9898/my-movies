import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { PlayerSource } from "@/app/types/player-source";
import type { Episode } from "@/app/types/movie";
import { getMovieDetail } from "@/app/services/movie-ophim-api";
import { getNguonCEpisodes } from "@/app/services/movie-nguonc-api";
import MainLayout from "@/app/shared/components/layout/main-layout";
import WatchWrapper from "@/app/features/watch/components/watch-wrapper";
import { Skeleton } from "@/components/ui/skeleton";

interface WatchPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
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

export default async function WatchPage({
  params,
  searchParams,
}: WatchPageProps) {
  const { slug } = await params;
  const query = (await searchParams) ?? {};

  const episodeQuery = parseQueryValue(query.episode);
  const providerQuery = parseQueryValue(query.provider);
  const serverQuery = parseQueryValue(query.server);

  const moviePromise = getMovieDetail(slug);

  // quick existence check to return 404 if missing
  const movieCheck = await moviePromise;
  if (!movieCheck) notFound();

  const nguoncEpisodesPromise =
    normalizeProvider(providerQuery) === "nguonc"
      ? getNguonCEpisodes(slug)
      : Promise.resolve([] as Episode[]);

  return (
    <MainLayout>
      <main className="space-y-8 pb-12 pt-6">
        <Suspense
          fallback={
            <div className="space-y-6">
              <Skeleton className="h-96 rounded-2xl" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <Skeleton className="h-56 rounded-lg" />
                <Skeleton className="h-56 rounded-lg" />
                <Skeleton className="h-56 rounded-lg" />
              </div>
            </div>
          }
        >
          <WatchWrapper
            moviePromise={moviePromise}
            nguoncEpisodesPromise={nguoncEpisodesPromise}
            episodeQuery={episodeQuery}
            providerQuery={providerQuery}
            serverQuery={serverQuery}
          />
        </Suspense>
      </main>
    </MainLayout>
  );
}
