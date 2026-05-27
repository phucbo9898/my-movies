"use client";

import * as React from "react";
import { Movie } from "@/app/types/movie";
import { Header } from "./header";
import { Container } from "./container";
import Banner from "@/app/features/movie/components/banner";

interface MainLayoutProps {
  children: React.ReactNode;
  bannerMovies?: Movie[];
}

export default function MainLayout({
  children,
  bannerMovies,
}: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#071018] via-[#04050a] to-[#000000] text-white">
      <Header />

      {/* Full-width banner (if provided) rendered outside the container */}
      {bannerMovies && bannerMovies.length > 0 && (
        <div className="w-full">
          <Banner movies={bannerMovies} />
        </div>
      )}

      <div className="relative flex flex-1">
        <div className="flex-1">
          <Container className="pb-24 md:pb-0">{children}</Container>
        </div>
      </div>
    </div>
  );
}
