"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { PlayerSource } from "@/app/types/player-source";
import { cn } from "@/lib/utils";

import { EmbedPlayer } from "./embed-player";
import { HlsVideoPlayer } from "./hls-player";

export interface PlayerSwitcherProps {
  sources: PlayerSource[];
  title?: string;
  description?: string;
  className?: string;
  defaultSource?: PlayerSource["type"];
  activeSource?: PlayerSource["type"];
  onSourceChange?: (source: PlayerSource) => void;
  autoPlay?: boolean;
  controls?: boolean;
  aspectRatio?: string;
  placeholder?: string;
}

const getSourceLabel = (source: PlayerSource) => {
  switch (source.type) {
    case "hls":
      return "HLS";
    case "embed":
      return "Embed";
    default:
      return "Player";
  }
};

const getSourceDescription = (source: PlayerSource) => {
  if (source.type === "hls") {
    return source.provider === "ophim" ? "Adaptive streaming" : "HLS source";
  }

  return source.provider === "nguonc" ? "Embedded player" : "External embed";
};

export function PlayerSwitcher({
  sources,
  title = "Player",
  description,
  className,
  defaultSource,
  activeSource,
  onSourceChange,
  autoPlay = true,
  controls = true,
  aspectRatio = "16 / 9",
  placeholder,
}: PlayerSwitcherProps) {
  const [selectedType, setSelectedType] = useState<PlayerSource["type"] | null>(
    defaultSource ?? null,
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef<HTMLElement>(null);

  const availableSources = useMemo(() => sources.filter(Boolean), [sources]);

  const selectedSource = useMemo(() => {
    if (!availableSources.length) {
      return null;
    }

    if (activeSource) {
      return (
        availableSources.find((source) => source.type === activeSource) ??
        availableSources[0]
      );
    }

    if (selectedType) {
      return (
        availableSources.find((source) => source.type === selectedType) ??
        availableSources[0]
      );
    }

    return availableSources[0];
  }, [activeSource, availableSources, selectedType]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === playerRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    const element = playerRef.current;
    if (!element) {
      return;
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    if (element.requestFullscreen) {
      await element.requestFullscreen();
    }
  };

  if (!selectedSource) {
    return (
      <section
        className={cn(
          "rounded-2xl border border-dashed border-white/10 bg-white/5 p-6",
          className,
        )}
      >
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="mt-2 text-sm text-zinc-300">
          No playable sources are available for this episode.
        </p>
      </section>
    );
  }

  const handleSelect = (source: PlayerSource) => {
    setSelectedType(source.type);
    onSourceChange?.(source);
  };

  return (
    <section className={cn("space-y-4", className)} ref={playerRef}>
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm text-zinc-300">{description}</p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {availableSources.map((source) => {
              const isActive =
                source.type === selectedSource.type &&
                source.url === selectedSource.url;

              return (
                <button
                  key={`${source.type}-${source.url}`}
                  type="button"
                  onClick={() => handleSelect(source)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm font-medium transition",
                    isActive
                      ? "border-primary bg-primary text-zinc-950"
                      : "border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/10",
                  )}
                >
                  {getSourceLabel(source)}
                </button>
              );
            })}

            <button
              type="button"
              onClick={toggleFullscreen}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10"
            >
              {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            </button>
          </div>
        </div>

        <p className="text-sm text-zinc-400">
          {getSourceDescription(selectedSource)}
        </p>
      </div>

      <div className="relative w-full" style={{ aspectRatio }}>
        {selectedSource.type === "hls" ? (
          <HlsVideoPlayer
            key={selectedSource.url}
            src={selectedSource.url}
            autoPlay={autoPlay}
            controls={controls}
            className="absolute inset-0 h-full w-full"
            poster={placeholder}
          />
        ) : (
          <EmbedPlayer
            url={selectedSource.url}
            title={`${getSourceLabel(selectedSource)} player`}
            className="absolute inset-0 h-full w-full"
          />
        )}
      </div>
    </section>
  );
}

export default PlayerSwitcher;
