import { useEffect, useState } from "react";
import { API_KEY } from "../helper/API";
import { useParams, Link } from "react-router-dom";
import movieClip from "../../icons folder/movieClip.svg";
import Loader from "../helper/Loader";
import Pagination from "../helper/Pagination";

export default function MovieGenreInfo() {
  const { id } = useParams();
  const [movieGenreDetails, setMovieGenreDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchMoviesByGenres = async () => {
      try {
        setIsLoading(true);

        const res = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${currentPage}&with_watch_monetization_types=flatrate&with_genres=${id}`
        );
        const data = await res.json();
        setMovieGenreDetails(data.results);
        setTotalPages(data.total_pages);

        console.log(data.total_pages);

        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMoviesByGenres();
  }, [id, currentPage]);

  const selectedGenre = movieGenreDetails?.map((movie) => {
    const releaseDate =
      movie.release_date?.slice(0, 4) || movie.first_air_date?.slice(0, 4);

    return (
      <Link to={`${movie.id}`} key={movie.id}>
        <div className="card_element relative mx-auto h-[250px] w-full rounded-md bg-nav lg:h-[300px]">
          <img
            src={`https://image.tmdb.org/t/p/original/${
              movie.backdrop_path || movie.poster_path
            }`}
            alt={movie.title}
            className="h-full w-full rounded-lg"
          />
          <div className="overlay absolute left-0 top-0 h-full w-full bg-[rgba(0,0,0,0.4)]"></div>
          <div className="info_container absolute bottom-6 left-4 text-white">
            <div className="year-container flex items-center gap-3">
              <p>{releaseDate}</p>
              <p className="flex items-center gap-1">
                <img
                  src={movieClip}
                  alt="movie clip element"
                  className="w-4 before:content-['.']"
                />
                <span>Movie</span>
              </p>
            </div>
            <div className="title text-2xl font-medium">
              {movie.title || movie.name}
            </div>
          </div>
        </div>
      </Link>
    );
  });

  const handlePageClick = (selectedPage) => {
    if (currentPage > totalPages) return;
    console.log(selectedPage);

    setCurrentPage(selectedPage.selected + 1);
  };

  return (
    <>
      <div className="genreMovie">
        {isLoading ? <Loader isLoading={isLoading} /> : selectedGenre}
      </div>
      <Pagination
        handlePageClick={handlePageClick}
        totalPageNumber={totalPages}
      />
    </>
  );
}