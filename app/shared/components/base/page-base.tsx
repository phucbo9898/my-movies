"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Base UI Components for consistent styling across pages
 * Uses semantic Tailwind tokens for light/dark mode support
 */

/**
 * PageHeader - Decorative header section with gradient background
 * Usage: Top section of pages with title and description
 */
export interface PageHeaderProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  description,
  children,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "relative mb-8 overflow-hidden rounded-3xl border border-border",
        "bg-linear-to-br from-accent/5 via-primary/5 to-transparent backdrop-blur-md",
        "p-6 sm:p-8 lg:p-12",
        "dark:border-white/10 dark:from-blue-600/10 dark:via-purple-600/10 dark:to-transparent",
        className,
      )}
      {...props}
    >
      {/* Decorative elements */}
      <div className="absolute -top-40 -right-40 h-80 w-80 bg-primary/20 rounded-full blur-3xl pointer-events-none dark:bg-blue-600/10" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 bg-secondary/20 rounded-full blur-3xl pointer-events-none dark:bg-purple-600/10" />

      {/* Content */}
      <div className="relative z-10 space-y-6">
        {subtitle && (
          <p className="text-xs uppercase tracking-widest text-primary font-semibold dark:text-blue-400">
            {subtitle}
          </p>
        )}

        {title && (
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            {title}
          </h1>
        )}

        {description && (
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed dark:text-zinc-400">
            {description}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}

/**
 * EmptyState - Display when no content is found
 */
export interface EmptyStateProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 sm:py-24",
        className,
      )}
      {...props}
    >
      {icon && <div className="relative mb-6">{icon}</div>}

      <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 text-center">
        {title}
      </h2>

      {description && (
        <p className="text-muted-foreground text-center max-w-sm mb-8 dark:text-zinc-400">
          {description}
        </p>
      )}

      {action}
    </div>
  );
}

/**
 * ResultsInfo - Display search/filter results metadata
 */
export interface ResultsInfoProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  stats?: React.ReactNode;
}

export function ResultsInfo({
  title,
  subtitle,
  stats,
  className,
  ...props
}: ResultsInfoProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6",
        "border-b border-border dark:border-white/10",
        className,
      )}
      {...props}
    >
      <div>
        {title && (
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-muted-foreground text-sm sm:text-base dark:text-zinc-400">
            {subtitle}
          </p>
        )}
      </div>

      {stats && (
        <div className="flex items-center gap-6 text-sm text-muted-foreground dark:text-zinc-400">
          {stats}
        </div>
      )}
    </div>
  );
}

/**
 * SuggestionsSection - Display suggestions/pills/tags
 */
export interface SuggestionsSectionProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  title: React.ReactNode;
  icon?: React.ReactNode;
  items: Array<{
    id: string;
    label: React.ReactNode;
    onSelect?: () => void;
  }>;
  variant?: "trending" | "recent" | "default";
}

export function SuggestionsSection({
  title,
  icon,
  items,
  variant = "default",
  className,
  ...props
}: SuggestionsSectionProps) {
  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case "trending":
        return {
          iconBg: "bg-orange-100 dark:bg-orange-600/30",
          iconColor: "text-orange-600 dark:text-orange-400",
          pillBase: "border-border bg-card text-muted-foreground",
          pillHover: "hover:bg-orange-50 hover:border-orange-300",
          darkModifiers:
            "dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-linear-to-r dark:hover:from-orange-600/30 dark:hover:to-red-600/30",
        };
      case "recent":
        return {
          iconBg: "bg-blue-100 dark:bg-blue-600/30",
          iconColor: "text-blue-600 dark:text-blue-400",
          pillBase: "border-blue-200 bg-blue-50 text-blue-700",
          pillHover: "hover:bg-blue-100 hover:border-blue-300",
          darkModifiers:
            "dark:border-blue-400/30 dark:bg-blue-600/10 dark:text-blue-300 dark:hover:bg-blue-600/20 dark:hover:border-blue-400/50",
        };
      default:
        return {
          iconBg: "bg-primary/10 dark:bg-primary/20",
          iconColor: "text-primary dark:text-primary",
          pillBase: "border-border bg-card text-foreground",
          pillHover: "hover:bg-accent hover:border-primary",
          darkModifiers:
            "dark:border-white/10 dark:bg-white/5 dark:text-zinc-300",
        };
    }
  };

  const classes = getVariantClasses(variant);

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && (
            <div className={cn("p-2 rounded-lg", classes.iconBg)}>
              <div className={classes.iconColor}>{icon}</div>
            </div>
          )}
          <h3 className="font-semibold text-foreground dark:text-white">
            {title}
          </h3>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={item.onSelect}
            className={cn(
              "px-3 py-2 rounded-lg border text-sm transition",
              classes.pillBase,
              classes.pillHover,
              classes.darkModifiers,
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * ColorGuide - Reference for semantic token usage
 *
 * Text Colors:
 * - text-foreground: Primary text (black light / white dark)
 * - text-muted-foreground: Secondary text (gray-500 light / zinc-400 dark)
 * - text-primary: Accent/interactive text (blue-600 light / blue-400 dark)
 *
 * Background Colors:
 * - bg-background: Page background (white light / black dark)
 * - bg-card: Card/section background (white light / gray-900 dark)
 * - bg-accent: Soft accent (blue-50 light / white/5 dark)
 * - bg-primary: Strong accent/buttons (blue-600 light / blue-500 dark)
 *
 * Border Colors:
 * - border-border: Subtle borders (gray-200 light / white/10 dark)
 * - border-primary: Accent borders (blue-200 light / blue-400 dark)
 *
 * Always pair with dark: prefix for dark mode:
 * className="bg-card dark:bg-zinc-900"
 * className="text-foreground dark:text-white"
 */
