import type { ReactNode } from "react";

interface MovieTrailerProps {
  trailerUrl: string;
}

function getYouTubeVideoId(url: string): string | null {
  try {
    const normalizedUrl = url.trim();
    const parsedUrl = new URL(normalizedUrl);
    const hostname = parsedUrl.hostname.replace(/^www\./, "");

    if (hostname === "youtu.be") {
      return parsedUrl.pathname.slice(1) || null;
    }

    if (hostname === "youtube.com" || hostname.endsWith("youtube.com")) {
      const pathname = parsedUrl.pathname;

      if (pathname.startsWith("/watch")) {
        return parsedUrl.searchParams.get("v") || null;
      }

      if (pathname.startsWith("/embed/")) {
        return pathname.split("/")[2] || null;
      }

      if (pathname.startsWith("/shorts/")) {
        return pathname.split("/")[2] || null;
      }
    }
  } catch {
    // Ignore invalid URLs.
  }

  return null;
}

function TrailerCard({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4 rounded-[28px] border border-white/10 bg-zinc-950/95 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.48)] sm:p-5">
      {children}
    </div>
  );
}

export function MovieTrailer({ trailerUrl }: MovieTrailerProps) {
  if (!trailerUrl) {
    return null;
  }

  const youtubeId = getYouTubeVideoId(trailerUrl);
  const embedUrl = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&showinfo=0`
    : null;

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">
            Trailer
          </p>
          <h3 className="text-xl font-semibold text-white sm:text-2xl">
            {youtubeId ? "YouTube Trailer" : "Trailer"}
          </h3>
        </div>
        {!youtubeId && (
          <p className="text-sm text-zinc-400">
            Video không hỗ trợ nhúng trực tiếp, mở liên kết bên ngoài.
          </p>
        )}
      </div>

      {embedUrl ? (
        <TrailerCard>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <div className="aspect-video w-full">
              <iframe
                src={embedUrl}
                title="Movie trailer"
                className="h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                loading="lazy"
              />
            </div>
          </div>
        </TrailerCard>
      ) : (
        <TrailerCard>
          <p className="text-sm leading-7 text-zinc-200">
            Đường dẫn trailer đã có dữ liệu nhưng không phải video YouTube có
            thể nhúng. Bạn có thể xem trailer bằng cách mở liên kết bên dưới.
          </p>
          <a
            href={trailerUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-transparent bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
          >
            Mở trailer
          </a>
        </TrailerCard>
      )}
    </section>
  );
}
