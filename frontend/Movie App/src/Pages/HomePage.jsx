import React, { useState, useEffect } from "react";
import MovieBoard from "../Components/MovieBoard";
import axios from "axios";

const HomePage = ({ user, setUser, selectedGenre, searchQuery }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get("http://ec2-13-126-126-15.ap-south-1.compute.amazonaws.com:8080/api/movies");
        setMovies(res.data);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
      }
    };
    fetchMovies();
  }, []);

  // Filter movies based on searchQuery (case-insensitive)
  const filteredMovies = movies.filter((movie) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    const titleMatch = movie.title.toLowerCase().includes(query);
    const yearMatch = movie.year.toString().includes(query);
    const genreMatch = movie.genre.toLowerCase().includes(query);

    return titleMatch || yearMatch || genreMatch;
  });

  return (
    <div style={{ background: "linear-gradient(to right, #141E30, #243B55)", minHeight: "100vh" }}>
      <MovieBoard movies={filteredMovies} selectedGenre={selectedGenre} user={user} />
    </div>
  );
};

export default HomePage;
