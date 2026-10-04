import { useState, useEffect } from "react"; 
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast"; 
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";

import css from "./App.module.css"; 

import SearchBar from "../SearchBar/SearchBar"; 
import MovieGrid from "../MovieGrid/MovieGrid"; 
import Loader from "../Loader/Loader"; 
import ErrorMessage from "../ErrorMessage/ErrorMessage"; 
import MovieModal from "../MovieModal/MovieModal"; 

import { fetchMovies } from "../../services/movieService"; 
import type { Movie } from "../../types/movie";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

export default function App() { 
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    const {data, isLoading, isError} = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
    placeholderData: keepPreviousData,
    });

    const movies = data?.results ?? [];
    const totalPages = data?.total_pages ?? 0;

    useEffect(() => {
        if (data && data.results.length === 0) {
            toast("No movies found for your request.");
        }
    }, [data]);

    const handleSearch = async (newQuery: string) => { 
        setQuery(newQuery);
        setPage(1);
        setSelectedMovie(null); 
    };

    return ( 
    <> 
        <Toaster />
        
        <SearchBar onSubmit={handleSearch} />

        <main className={css.app}> 
            {isLoading ? ( 
                <Loader /> 
            ) : isError ? ( 
                <ErrorMessage /> 
            ) : movies.length > 0 ? ( 
                <>
                {totalPages > 1 && (
                <ReactPaginate
                pageCount={totalPages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
                onPageChange={({ selected }) => setPage(selected + 1)}
                forcePage={page - 1}
                containerClassName={css.pagination}
                activeClassName={css.active}
                nextLabel="→"
                previousLabel="←"
                />
                )}

                <MovieGrid 
                    movies={movies} 
                    onSelect={setSelectedMovie} 
                />
                </>
            ) : null}
        </main> 
        
        {selectedMovie && ( 
            <MovieModal 
                movie={selectedMovie} 
                onClose={() => setSelectedMovie(null)} 
            /> 
        )} 
    </> 
); 
}