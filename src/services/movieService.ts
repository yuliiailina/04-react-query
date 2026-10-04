import axios from "axios";
import type { FetchMoviesResponse } from "../types/movie";



export async function fetchMovies(
  query: string,
  page: number
): Promise<FetchMoviesResponse> {
  console.log(import.meta.env.VITE_TMDB_TOKEN);
  const response = await axios.get<FetchMoviesResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        query,
        page
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    }
  );

  return response.data;
}