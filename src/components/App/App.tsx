import { useState } from "react"; 
import toast, { Toaster } from "react-hot-toast"; 

import css from "./App.module.css"; 

import SearchBar from "../SearchBar/SearchBar"; 
import MovieGrid from "../MovieGrid/MovieGrid"; 
import Loader from "../Loader/Loader"; 
import ErrorMessage from "../ErrorMessage/ErrorMessage"; 
import MovieModal from "../MovieModal/MovieModal"; 

import { fetchMovies } from "../../services/movieService"; 
import type { Movie } from "../../types/movie";

export default function App() { 
    const [movies, setMovies] = useState<Movie[]>([]); 
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(false); 
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const handleSearch = async (query: string) => { 
        setMovies([]); 
        setError(false); 
        setSelectedMovie(null); 
        setLoading(true);

        try {
            const data = await fetchMovies(query); 
            
            if (data.length === 0) { 
                toast("No movies found for your request."); 
        }
            setMovies(data); 
        } catch { 
            setError(true); 
        } finally { 
            setLoading(false); 
        } 
    };

    return ( 
    <> 
        <Toaster />
        
        <SearchBar onSubmit={handleSearch} />

        <main className={css.app}> 
            {loading ? ( 
                <Loader /> 
            ) : error ? ( 
                <ErrorMessage /> 
            ) : movies.length > 0 ? ( 
                <MovieGrid 
                    movies={movies} 
                    onSelect={setSelectedMovie} 
                /> 
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