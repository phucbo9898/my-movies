import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import type { MovieDetail } from "@/app/types/movie-detail";

interface MovieDetailHeroProps {
  movie: MovieDetail;
}

export function MovieDetailHero({ movie }: MovieDetailHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-zinc-950 shadow-2xl">
      <div className="absolute inset-0">
        <Image
          src={movie.poster_url || movie.thumb_url}
          alt={movie.name}
          fill
          className="object-cover opacity-30 blur-sm"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-zinc-950/95 via-zinc-950/75 to-transparent" />
      </div>

      <div className="relative z-10 px-5 py-6 sm:px-8 lg:px-10 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(260px,320px),1fr]">
          <div className="flex flex-col gap-5">
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-zinc-950/80 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
              <Image
                src={movie.poster_url || movie.thumb_url}
                alt={movie.name}
                width={420}
                height={630}
                className="h-full w-full object-cover"
                priority
              />
              {/* <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent px-4 py-4">
                <p className="text-sm uppercase tracking-[0.2em] text-zinc-200/80">
                  Poster
                </p>
              </div> */}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300 ring-1 ring-emerald-300/20">
                  {movie.status}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-100">
                  {movie.type}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-100">
                  {movie.quality}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-100">
                  {movie.lang}
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {movie.name}
                </h1>
                <p className="max-w-2xl text-lg text-zinc-300 sm:text-xl">
                  {movie.origin_name}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[28px] border border-white/10 bg-white/5 px-5 py-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">
                    Year
                  </p>
                  <p className="mt-3 text-base font-semibold text-white">
                    {movie.year || "—"}
                  </p>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-white/5 px-5 py-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">
                    Duration
                  </p>
                  <p className="mt-3 text-base font-semibold text-white">
                    {movie.time || "—"}
                  </p>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-white/5 px-5 py-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">
                    Episodes
                  </p>
                  <p className="mt-3 text-base font-semibold text-white">
                    {movie.episode_current}/{movie.episode_total}
                  </p>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-white/5 px-5 py-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">
                    Views
                  </p>
                  <p className="mt-3 text-base font-semibold text-white">
                    {movie.view}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href={`/watch/${movie.slug}`}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 shadow-xl shadow-white/10 transition duration-200 hover:-translate-y-0.5 hover:bg-zinc-100"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-950 text-white">
                    <Play className="h-5 w-5" />
                  </span>
                  Watch now
                </Link>
                {movie.trailer_url ? (
                  <a
                    href={movie.trailer_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/90 px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-zinc-800"
                  >
                    Trailer
                  </a>
                ) : (
                  <div className="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/90 px-6 py-3 text-sm font-semibold text-zinc-400">
                    No trailer available
                  </div>
                )}
              </div>

              <div className="rounded-[32px] border border-white/10 bg-zinc-950/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">
                  Synopsis
                </p>
                <div className="mt-4 space-y-4 text-sm leading-7 text-zinc-100/95">
                  {movie.content ? (
                    <div dangerouslySetInnerHTML={{ __html: movie.content }} />
                  ) : (
                    <p>Nội dung tóm tắt chưa có sẵn cho bộ phim này.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
