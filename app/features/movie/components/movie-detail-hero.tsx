import Image from "next/image";
import { Play } from "lucide-react";
import type { MovieDetail } from "@/app/types/movie-detail";

interface MovieDetailHeroProps {
  movie: MovieDetail;
}

export function MovieDetailHero({ movie }: MovieDetailHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950">
      <div className="absolute inset-0">
        <Image
          src={movie.poster_url || movie.thumb_url}
          alt={movie.name}
          fill
          className="object-cover opacity-45"
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,7,18,0.96)_0%,rgba(3,7,18,0.85)_42%,rgba(3,7,18,0.55)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(244,63,94,0.16),transparent_24%)]" />
      </div>

      <div className="relative z-10 grid gap-8 px-5 py-6 sm:px-7 lg:grid-cols-[minmax(220px,320px),1fr] lg:px-8 lg:py-8">
        {/* <div className="relative aspect-[2/3] h-72 w-full overflow-hidden rounded-[24px] border border-white/10 bg-zinc-900/70 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
          <Image
            src={movie.poster_url}
            alt={movie.name}
            width={500}
            height={300}
            className="object-cover"
            priority
          />
        </div> */}

        <div className="flex flex-col justify-end gap-5">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-300/85">
              {movie.status}
            </p>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                {movie.name}
              </h1>
              <p className="text-sm text-zinc-200 sm:text-base">
                {movie.origin_name}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-sm text-zinc-100">
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 backdrop-blur-sm">
              {movie.type}
            </span>
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 backdrop-blur-sm">
              {movie.quality}
            </span>
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 backdrop-blur-sm">
              {movie.lang}
            </span>
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 backdrop-blur-sm">
              {movie.episode_current}/{movie.episode_total}
            </span>
          </div>

          <div className="grid gap-3 text-sm text-zinc-100 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-300">
                Year
              </p>
              <p className="mt-1 text-base font-semibold text-white">
                {movie.year || "—"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-300">
                Duration
              </p>
              <p className="mt-1 text-base font-semibold text-white">
                {movie.time || "—"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-300">
                Views
              </p>
              <p className="mt-1 text-base font-semibold text-white">
                {movie.view}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-300">
                Country
              </p>
              <p className="mt-1 text-base font-semibold text-white">
                {movie.country.map((item) => item.name).join(", ") || "—"}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-200">
              Description
            </h2>
            <p className="max-w-3xl leading-7 text-zinc-100/95">
              {movie.content || "No overview available."}
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950 shadow-[0_20px_60px_rgba(255,255,255,0.18)] transition hover:scale-[1.01] hover:bg-zinc-100 sm:px-6 sm:py-4"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-950 text-white">
                <Play className="ml-0.5 h-5 w-5 fill-current" />
              </span>
              <span className="text-base sm:text-lg">Watch now</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
