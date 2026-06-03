import { notFound } from "next/navigation";
import MainLayout from "../../shared/components/layout/main-layout";
import { getMovieDetail } from "../../services/movie-ophim-api";
import MovieDetailWrapper from "@/app/features/movie/components/movie-detail-wrapper";
import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface MovieDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function MovieDetailPage({
  params,
}: MovieDetailPageProps) {
  const { slug } = await params;

  const moviePromise = getMovieDetail(decodeURIComponent(slug));
  const movieCheck = await moviePromise;
  if (!movieCheck) {
    notFound();
  }

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
          <MovieDetailWrapper moviePromise={moviePromise} />
        </Suspense>
      </main>
    </MainLayout>
  );
}
