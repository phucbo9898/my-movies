"use client";

import { Category } from "@/app/types/movie";
import { cn } from "@/lib/utils";
import { ChevronDown, Film, Flame, Home, Star, X } from "lucide-react";

const navItems = [
  { label: "Home", icon: Home },
  { label: "Trending", icon: Flame },
  { label: "Top Rated", icon: Star },
  { label: "New Releases", icon: Film },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  genres: Category[];
}

export function Sidebar({ open, onClose, genres }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto border-r border-white/10 bg-zinc-950/95 px-6 py-6 shadow-2xl shadow-black/40 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-none",
        open ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
            Featured
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Explore</h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-100 transition hover:border-white/20 hover:bg-white/10 lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-8 space-y-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              href="#"
              className="group flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/20 hover:bg-white/10"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-zinc-200 transition group-hover:bg-primary group-hover:text-zinc-950">
                <Icon className="h-5 w-5" />
              </span>
              <span>{item.label}</span>
            </a>
          );
        })}
      </div>

      <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-zinc-300">
        <div className="group relative">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-3xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-left text-sm text-zinc-200 transition hover:border-white/20 hover:bg-white/10"
          >
            <span className="font-semibold">Genres</span>
            <ChevronDown className="h-4 w-4 text-zinc-400" />
          </button>

          <div className="pointer-events-none absolute left-0 right-0 top-full z-20 mt-2 hidden max-h-72 overflow-y-auto rounded-3xl border border-white/10 bg-zinc-950/95 p-3 shadow-2xl shadow-black/40 transition duration-200 group-hover:block group-hover:pointer-events-auto">
            {genres.length > 0 ? (
              <div className="grid gap-2">
                {genres.map((genre) => (
                  <a
                    key={genre.slug}
                    href="#"
                    className="block rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 transition hover:border-white/20 hover:bg-white/10"
                  >
                    {genre.name}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">No genres available yet.</p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
