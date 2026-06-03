import { Movie } from "@/app/types/movie";
import { MovieGrid } from "./movie-grid";

interface GenreMoviesWrapperProps {
  moviesPromise: Promise<Movie[]>;
}

export default async function GenreMoviesWrapper({
  moviesPromise,
}: GenreMoviesWrapperProps) {
  const movies = await moviesPromise;
  return <MovieGrid movies={movies} />;
}
