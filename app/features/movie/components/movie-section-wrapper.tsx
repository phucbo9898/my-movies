import { HomeMovieSection } from "./home-movie-section";
import { Movie } from "@/app/types/movie";

interface MovieSectionWrapperProps {
  title: string;
  moviesPromise: Promise<Movie[]>;
}

export default async function MovieSectionWrapper({
  title,
  moviesPromise,
}: MovieSectionWrapperProps) {
  const movies = await moviesPromise;
  return <HomeMovieSection title={title} movies={movies} />;
}
