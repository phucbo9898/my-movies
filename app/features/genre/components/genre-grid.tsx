"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { Genre } from "@/app/types/genre";
import {
  Film,
  Zap,
  Heart,
  Laugh,
  Eye,
  Flame,
  Shield,
  Skull,
  BookOpen,
  Wand2,
  Navigation,
  Sparkles,
} from "lucide-react";

interface GenreGridProps {
  genres: Genre[];
}

const genreIconMap = [
  { keywords: ["hành động", "hanh-dong", "hanh_dong", "action"], icon: Zap },
  {
    keywords: ["lãng mạn", "lang-man", "lang_man", "romance"],
    icon: Heart,
  },
  {
    keywords: ["hài hước", "hai-huoc", "hai_huoc", "comedy"],
    icon: Laugh,
  },
  {
    keywords: ["tâm lý", "tam-ly", "tam_ly", "drama"],
    icon: Eye,
  },
  {
    keywords: ["kinh dị", "kinh-di", "kinh_di", "horror"],
    icon: Flame,
  },
  {
    keywords: ["anh hùng", "anh-hung", "anh_hung", "superhero"],
    icon: Shield,
  },
  {
    keywords: ["kinh điển", "kinh-dien", "kinh_dien", "classic"],
    icon: Skull,
  },
  {
    keywords: ["học đường", "hoc-duong", "hoc_duong", "school"],
    icon: BookOpen,
  },
  {
    keywords: ["thần tiên", "than-tien", "than_tien", "fantasy"],
    icon: Wand2,
  },
  {
    keywords: ["phiêu lưu", "phieu-luu", "phieu_luu", "adventure"],
    icon: Navigation,
  },
  {
    keywords: ["viễn tưởng", "vien-tuong", "vien_tuong", "sci-fi"],
    icon: Sparkles,
  },
];

const getIconForGenre = (
  name: string,
  slug: string,
): React.ComponentType<{ size: number; className?: string }> => {
  const searchStr = `${name} ${slug}`.toLowerCase();

  for (const { keywords, icon } of genreIconMap) {
    if (keywords.some((keyword) => searchStr.includes(keyword))) {
      return icon;
    }
  }

  return Film;
};

export const GenreGrid = ({ genres }: GenreGridProps) => {
  if (!genres || genres.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-400">
        Không tìm thấy danh mục nào
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {genres.map((genre) => {
        const IconComponent = getIconForGenre(genre.name, genre.slug);
        return (
          <Link key={genre._id} href={`/genre/${genre.slug}`}>
            <Card className="h-40 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all hover:scale-105 hover:shadow-lg bg-zinc-900 border-zinc-800 hover:border-zinc-700">
              <IconComponent size={32} className="text-red-500" />
              <h3 className="text-sm font-medium text-white text-center px-2">
                {genre.name}
              </h3>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};
