import { PlayerSource } from "./player-source";

export interface Category {
  name: string;
  slug: string;
}

export interface Country {
  name: string;
  slug: string;
}

export interface Movie {
  _id: string;
  name: string;
  origin_name: string;
  slug: string;
  poster_url: string;
  thumb_url: string;
  content: string;
  type: string;
  status: string;
  actor: string[];
  director: string[];
  category: Category[];
  country: Country[];
  episode_current: string;
  episode_total: string;
  time: string;
  quality: string;
  lang: string;
  view: number;
  alternative_names: string[];
  year: number;
}

export interface Episode {
  server_name: string;
  slug: string;
  server_data: ServerData[];
}

export interface ServerData {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
  sources: PlayerSource[];
}
