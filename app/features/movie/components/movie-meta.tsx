import type { MovieDetail } from "@/app/types/movie-detail";

interface MovieMetaProps {
  movie: MovieDetail;
}

export function MovieMeta({ movie }: MovieMetaProps) {
  const metaItems = [
    { label: "Year", value: movie.year || "—" },
    { label: "Duration", value: movie.time || "—" },
    { label: "Views", value: `${movie.view}` },
    {
      label: "Country",
      value: movie.country.map((item) => item.name).join(", ") || "—",
    },
  ];

  return (
    <section className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
      <div className="space-y-5">
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">
            Genres
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {movie.category.map((item) => (
              <span
                key={item.id}
                className="rounded-full border border-white/10 bg-zinc-950/70 px-3 py-1 text-sm text-zinc-100"
              >
                {item.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {metaItems.map((item) => (
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

        {movie.actor.length > 0 && (
          <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 sm:col-span-2">
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">
              Cast
            </p>
            <p className="mt-2 text-sm leading-7 text-zinc-100/95">
              {movie.actor.join(", ")}
            </p>
          </div>
        )}

        {movie.director.length > 0 && (
          <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 sm:col-span-2">
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">
              Director
            </p>
            <p className="mt-2 text-sm leading-7 text-zinc-100/95">
              {movie.director.join(", ")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
