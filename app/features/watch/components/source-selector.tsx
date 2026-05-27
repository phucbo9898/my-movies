"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

export type SourceProviderKey = string;

export interface SourceProviderOption {
  key: SourceProviderKey;
  label: string;
  description?: string;
  badge?: string;
}

export interface SourceSelectorProps {
  providers: SourceProviderOption[];
  activeProvider?: SourceProviderKey;
  defaultActiveProvider?: SourceProviderKey;
  onSelect?: (provider: SourceProviderOption) => void;
  title?: string;
  emptyLabel?: string;
  className?: string;
}

export function SourceSelector({
  providers,
  activeProvider,
  defaultActiveProvider,
  onSelect,
  title = "Providers",
  emptyLabel = "No providers available",
  className,
}: SourceSelectorProps) {
  const availableProviders = useMemo(() => providers.filter(Boolean), [providers]);
  const [internalActiveProvider, setInternalActiveProvider] = useState<
    SourceProviderKey | undefined
  >(
    defaultActiveProvider ?? availableProviders[0]?.key,
  );

  const currentActiveProvider =
    activeProvider !== undefined
      ? activeProvider
      : internalActiveProvider ?? availableProviders[0]?.key;

  if (!availableProviders.length) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-white/10 bg-zinc-950/85 p-4 text-sm text-zinc-300",
          className,
        )}
      >
        <p className="font-semibold text-white">{title}</p>
        <p className="mt-2">{emptyLabel}</p>
      </div>
    );
  }

  const activeOption =
    availableProviders.find((provider) => provider.key === currentActiveProvider) ??
    availableProviders[0];

  const handleSelect = (provider: SourceProviderOption) => {
    if (activeProvider === undefined) {
      setInternalActiveProvider(provider.key);
    }

    onSelect?.(provider);
  };

  return (
    <section
      className={cn(
        "rounded-2xl border border-white/10 bg-zinc-950/85 p-4 sm:p-5",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-300">{title}</p>
          <p className="mt-2 text-sm text-zinc-300">
            {availableProviders.length} available
          </p>
        </div>

        <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {activeOption.label}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {availableProviders.map((provider) => {
          const isActive = provider.key === activeOption.key;

          return (
            <button
              key={provider.key}
              type="button"
              aria-pressed={isActive}
              onClick={() => handleSelect(provider)}
              className={cn(
                "rounded-xl border px-3 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-primary/60",
                isActive
                  ? "border-primary bg-primary text-zinc-950 shadow-[0_0_0_1px_rgba(244,114,182,0.35)]"
                  : "border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/10",
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{provider.label}</span>
                {provider.badge ? (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em]",
                      isActive ? "bg-zinc-950/10 text-zinc-900" : "bg-white/10 text-zinc-100",
                    )}
                  >
                    {provider.badge}
                  </span>
                ) : null}
              </div>
              {provider.description ? (
                <p
                  className={cn(
                    "mt-1 text-xs",
                    isActive ? "text-zinc-900/80" : "text-zinc-300",
                  )}
                >
                  {provider.description}
                </p>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default SourceSelector;
