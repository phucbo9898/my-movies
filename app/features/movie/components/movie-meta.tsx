import type { MovieDetail } from "@/app/types/movie-detail";
import { MovieTrailer } from "@/app/features/movie/components/movie-trailer";

interface MovieMetaProps {
  movie: MovieDetail;
}

export function MovieMeta({ movie }: MovieMetaProps) {
  const quickFacts = [
    { label: "Release year", value: movie.year || "—" },
    { label: "Duration", value: movie.time || "—" },
    { label: "Views", value: `${movie.view}` },
    {
      label: "Episodes",
      value: `${movie.episode_current}/${movie.episode_total}`,
    },
    {
      label: "Country",
      value: movie.country.map((item) => item.name).join(", ") || "—",
    },
    { label: "Language", value: movie.lang || "—" },
    { label: "Quality", value: movie.quality || "—" },
    { label: "Type", value: movie.type || "—" },
  ];

  return (
    <section className="grid gap-6 xl:grid-cols-[1.5fr,0.85fr]">
      <div className="space-y-6">
        <div className="rounded-[32px] border border-white/10 bg-zinc-950/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">
                Overview
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Deep dive
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-zinc-300">
              {movie.origin_name}
            </p>
          </div>
          <div className="mt-6 rounded-[28px] border border-white/10 bg-zinc-950/70 p-5 text-sm leading-7 text-zinc-100/95">
            {movie.content ? (
              <div dangerouslySetInnerHTML={{ __html: movie.content }} />
            ) : (
              <p>Thông tin mô tả chưa có sẵn. Hãy kiểm tra lần sau.</p>
            )}
          </div>
        </div>

        <MovieTrailer trailerUrl={movie.trailer_url} />
      </div>

      <div className="space-y-6">
        <div className="rounded-[32px] border border-white/10 bg-zinc-950/80 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">
                Quick facts
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white">
                Thông tin nhanh
              </h3>
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {quickFacts.map((item) => (
              <div
                key={item.label}
                className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4"
              >
                <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                  {item.label}
                </p>
                <p className="mt-2 text-base font-semibold text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-zinc-950/80 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">
            Genres
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {movie.category.map((item) => (
              <span
                key={item.id}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-100"
              >
                {item.name}
              </span>
            ))}
          </div>
        </div>

        {movie.actor.length > 0 && (
          <div className="rounded-[32px] border border-white/10 bg-zinc-950/80 p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">
              Cast
            </p>
            <p className="mt-4 text-sm leading-7 text-zinc-100/95">
              {movie.actor.join(", ")}
            </p>
          </div>
        )}

        {movie.director.length > 0 && (
          <div className="rounded-[32px] border border-white/10 bg-zinc-950/80 p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">
              Director
            </p>
            <p className="mt-4 text-sm leading-7 text-zinc-100/95">
              {movie.director.join(", ")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
