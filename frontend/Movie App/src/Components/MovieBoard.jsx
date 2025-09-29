import React, { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import axios from "axios";

const MovieBoard = ({ movies = [], selectedGenre, user }) => {
  const [userWatchlist, setUserWatchlist] = useState([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!userId || !token) return;

      try {
        const response = await axios.get(`http://localhost:8080/api/users/${userId}`, {
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

  const filteredMovies = Array.isArray(movies)
    ? selectedGenre
      ? movies.filter((movie) =>
          (movie.genre || "").toLowerCase().includes(selectedGenre.toLowerCase())
        )
      : movies
    : [];

  return (
    <div className="container my-4">
      <div className="row g-4">
        {filteredMovies.length === 0 && (
          <p className="text-light text-center w-100">No movies available for this genre.</p>
        )}
        {filteredMovies.map((movie) => (
          <div className="col-md-4" key={movie._id || movie.id}>
            <MovieCard movie={movie} userWatchlist={userWatchlist} setUserWatchlist={setUserWatchlist} user={user} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieBoard;
