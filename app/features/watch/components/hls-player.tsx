"use client";

import { useEffect, useRef, useState } from "react";
import Hls, { type ErrorData } from "hls.js";

import { cn } from "@/lib/utils";

export interface HlsPlayerProps {
  url?: string;
  src?: string;
  autoPlay?: boolean;
  controls?: boolean;
  className?: string;
  poster?: string;
  title?: string;
}

export type HlsVideoPlayerProps = HlsPlayerProps;

function getSourceUrl(url?: string, src?: string) {
  return url ?? src ?? "";
}

export function HlsPlayer({
  url,
  src,
  autoPlay = true,
  controls = true,
  className,
  poster,
  title = "HLS player",
}: HlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const sourceUrl = getSourceUrl(url, src);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !sourceUrl) {
      return;
    }

    setError(null);
    setIsReady(false);

    const canPlayNativeHls =
      typeof window !== "undefined" &&
      video.canPlayType("application/vnd.apple.mpegurl") !== "";

    const clearVideo = () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
    };

    if (!Hls.isSupported() && !canPlayNativeHls) {
      setError("This browser cannot play HLS streams.");
      clearVideo();
      return;
    }

    if (!Hls.isSupported()) {
      video.src = sourceUrl;

      if (autoPlay) {
        video.muted = true;
        void video.play().catch(() => undefined);
      }

      return () => {
        clearVideo();
      };
    }

    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: false,
      capLevelToPlayerSize: true,
      startLevel: -1,
    });

    const handleError = (_event: unknown, data: ErrorData) => {
      if (data.fatal) {
        setError(data.details || "Unable to load this stream.");
      }
    };

    hls.on(Hls.Events.ERROR, handleError);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      hls.currentLevel = hls.levels.length - 1;
      setIsReady(true);
      if (autoPlay) {
        video.muted = true;
        void video.play().catch(() => undefined);
      }
    });

    hls.loadSource(sourceUrl);
    hls.attachMedia(video);

    return () => {
      hls.off(Hls.Events.ERROR, handleError);
      hls.destroy();
      clearVideo();
    };
  }, [autoPlay, sourceUrl]);

  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-2xl bg-black",
        className,
      )}
    >
      {error ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/85 px-4 text-center">
          <p className="max-w-sm text-sm text-white">{error}</p>
        </div>
      ) : null}

      <video
        ref={videoRef}
        className={cn(
          "h-full w-full object-contain transition-opacity duration-300",
          isReady ? "opacity-100" : "opacity-80",
        )}
        controls={controls}
        autoPlay={autoPlay}
        muted={autoPlay}
        playsInline
        preload="metadata"
        poster={poster}
        title={title}
      />
    </div>
  );
}

export function HlsVideoPlayer(props: HlsVideoPlayerProps) {
  return <HlsPlayer {...props} />;
}

export default HlsPlayer;
