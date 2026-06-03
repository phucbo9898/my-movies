"use client";

import * as React from "react";
import { Movie } from "@/app/types/movie";
import { Header } from "./header";
import { Container } from "./container";
import Banner from "@/app/features/movie/components/banner";
import { Footer } from "./footer";
import BottomNav from "./bottom-nav";

interface MainLayoutProps {
  children: React.ReactNode;
  bannerMovies?: Movie[];
  banner?: React.ReactNode;
}

export default function MainLayout({
  children,
  bannerMovies,
  banner,
}: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      {/* Full-width banner (if provided) rendered outside the container */}
      {banner ? (
        <div className="w-full">{banner}</div>
      ) : bannerMovies && bannerMovies.length > 0 ? (
        <div className="w-full">
          <Banner movies={bannerMovies} />
        </div>
      ) : null}

      <div className="relative flex flex-1">
        <div className="flex-1 w-full">
          <Container className="pb-24 md:pb-0">{children}</Container>
        </div>
      </div>
      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Footer */}
      <Footer />
    </div>
  );
}
