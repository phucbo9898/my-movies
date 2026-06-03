import Banner from "./banner";
import { Movie } from "@/app/types/movie";

interface BannerWrapperProps {
  moviesPromise: Promise<Movie[]>;
}

export default async function BannerWrapper({
  moviesPromise,
}: BannerWrapperProps) {
  const movies = await moviesPromise;
  return <Banner movies={movies} />;
}
