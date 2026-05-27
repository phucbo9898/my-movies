"use client";

import * as React from "react";
import { Genre } from "@/app/types/genre";
import { Header } from "./header";
import { Container } from "./container";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_25%),linear-gradient(180deg,#030712_0%,#090b11_45%,#05070d_100%)] text-white">
      <Header />
      <div className="relative flex flex-1">
        <div className="flex-1">
          <Container className="pb-24 md:pb-0">{children}</Container>
        </div>
      </div>
    </div>
  );
}
