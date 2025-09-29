import React, { useState, useEffect } from "react";
import MovieBoard from "../components/MovieBoard";
import axios from "axios";

const HomePage = ({ user, setUser, selectedGenre }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/movies");
        setMovies(res.data);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div style={{ background: "linear-gradient(to right, #141E30, #243B55)", minHeight: "100vh" }}>
      <MovieBoard movies={movies} selectedGenre={selectedGenre} user={user} />
    </div>
  );
};

export default HomePage;
