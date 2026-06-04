import type { Country, Episode } from "./movie";
import type { MovieGenre } from "./genre";

export interface MovieDetail {
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
  category: MovieGenre[];
  country: Country[];
  episode_current: string;
  episode_total: string;
  time: string;
  quality: string;
  lang: string;
  view: number;
  alternative_names: string[];
  year: number;
  episodes: Episode[];
  trailer_url: string;
}
