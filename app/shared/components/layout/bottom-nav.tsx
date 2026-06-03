"use client";

import Link from "next/link";
import { Home, Grid, Film, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

function NavItem({
  href,
  label,
  Icon,
  active,
}: {
  href: string;
  label: string;
  Icon: LucideIcon;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        "flex flex-col items-center justify-center gap-1 rounded-2xl py-2 px-3 transition-all " +
        (active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/70")
      }
    >
      <Icon className="h-5 w-5" />
      <span className="text-xs">{label}</span>
    </Link>
  );
}

export default function BottomNav() {
  const pathname = usePathname() || "/";

  return (
    <nav
      aria-hidden={false}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">
            <NavItem
              href="/"
              label="Home"
              Icon={Home}
              active={pathname === "/"}
            />
          </div>
          <div className="flex-1">
            <NavItem
              href="/genres"
              label="Category"
              Icon={Grid}
              active={pathname?.startsWith("/genre") || pathname === "/genres"}
            />
          </div>
          <div className="flex-1">
            <NavItem
              href="/movie"
              label="Movie"
              Icon={Film}
              active={pathname?.startsWith("/movie") || pathname === "/search"}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
