"use client";

import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export interface LoadingOverlayProps {
  isVisible: boolean;
  title?: string;
  description?: string;
  status?: "loading" | "buffering";
  className?: string;
}

export function LoadingOverlay({
  isVisible,
  title = "Loading player",
  description,
  status = "loading",
  className,
}: LoadingOverlayProps) {
  if (!isVisible) {
    return null;
  }

  const message =
    status === "buffering"
      ? "Buffering stream..."
      : (description ?? "Preparing your cinematic experience...");

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-[linear-gradient(180deg,rgba(2,6,23,0.92),rgba(2,6,23,0.68))] px-6 text-center backdrop-blur-sm transition-opacity duration-300",
        className,
      )}
    >
      <div className="max-w-sm rounded-[28px] border border-white/10 bg-black/45 px-6 py-5 shadow-[0_28px_80px_rgba(15,23,42,0.65)] backdrop-blur-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center">
          <span className="absolute h-16 w-16 rounded-full bg-fuchsia-500/30 blur-xl animate-pulse" />
          <span className="absolute h-12 w-12 rounded-full border border-white/10 bg-white/5" />
          <Loader2 className="relative h-6 w-6 animate-spin text-white" />
        </div>

        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.24em] text-white/90">
          {title}
        </p>
        <p className="mt-2 text-sm leading-6 text-zinc-200/90">{message}</p>
      </div>
    </div>
  );
}

export default LoadingOverlay;
