import React, { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import axios from "axios";

const MovieBoard = ({ movies = [], selectedGenre, searchQuery = "", user }) => {
  const [userWatchlist, setUserWatchlist] = useState([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!userId || !token) return;

      try {
        const response = await axios.get(`8080/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const watchlist = Array.isArray(response.data.watchlist)
          ? response.data.watchlist.map((id) => id)
          : [];
        setUserWatchlist(watchlist);
      } catch (err) {
        console.error("Failed to fetch watchlist:", err);
        setUserWatchlist([]);
      }
    };

    fetchWatchlist();
  }, [userId, token]);

  // Filter movies by selectedGenre and searchQuery
  const filteredMovies = Array.isArray(movies)
    ? movies.filter((movie) => {
        const genreMatch = selectedGenre
          ? (movie.genre || "").toLowerCase().includes(selectedGenre.toLowerCase())
          : true;

        const query = searchQuery.toLowerCase();
        const searchMatch =
          !searchQuery ||
          (movie.title && movie.title.toLowerCase().includes(query)) ||
          (movie.year && movie.year.toString().includes(query)) ||
          (movie.genre && movie.genre.toLowerCase().includes(query));

        return genreMatch && searchMatch;
      })
    : [];

  return (
    <div className="container my-4">
      <div className="row g-4">
        {filteredMovies.length === 0 && (
          <p className="text-light text-center w-100">
            No movies available for this genre or search.
          </p>
        )}
        {filteredMovies.map((movie) => (
          <div className="col-md-4" key={movie._id || movie.id}>
            <MovieCard
              movie={movie}
              userWatchlist={userWatchlist}
              setUserWatchlist={setUserWatchlist}
              user={user}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieBoard;
