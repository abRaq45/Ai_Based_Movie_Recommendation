import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const MovieCard = ({
  movie,
  userWatchlist = [],
  setUserWatchlist,
  isInWatchlist: propIsInWatchlist,
}) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const [isInWatchlist, setIsInWatchlist] = useState(
    typeof propIsInWatchlist === "boolean"
      ? propIsInWatchlist
      : userWatchlist.includes(movie._id || movie.id)
  );

  // Sync state if prop changes (optional)
  useEffect(() => {
    if (typeof propIsInWatchlist === "boolean") {
      setIsInWatchlist(propIsInWatchlist);
    } else {
      setIsInWatchlist(userWatchlist.includes(movie._id || movie.id));
    }
  }, [propIsInWatchlist, userWatchlist, movie._id, movie.id]);

  const handleWatchlistToggle = async () => {
    if (!token || !userId) return;

    try {
      if (isInWatchlist) {
        await axios.delete(
          `http://ec2-13-126-126-15.ap-south-1.compute.amazonaws.com:8080/api/users/${userId}/watchlist/${movie._id || movie.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsInWatchlist(false);
        setUserWatchlist((prev) =>
          prev.filter((id) => id !== (movie._id || movie.id))
        );
      } else {
        await axios.post(
          `http://ec2-13-126-126-15.ap-south-1.compute.amazonaws.com:8080/api/users/${userId}/watchlist/${movie._id || movie.id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsInWatchlist(true);
        setUserWatchlist((prev) => [...prev, movie._id || movie.id]);
      }
    } catch (err) {
      console.error("Watchlist update failed:", err);
    }
  };

  return (
    <motion.div
      className="card shadow-lg h-100"
      style={{
        width: "100%",
        maxWidth: "350px",
        minHeight: 550,
        borderRadius: "18px",
        overflow: "hidden",
        background: "#1c1c1c",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        margin: "0 auto",
      }}
      whileHover={{
        scale: 1.04,
        boxShadow: "0 8px 28px rgba(32,59,179,0.21)",
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <img
        src={movie.posterUrl}
        alt={movie.title}
        style={{
          width: "100%",
          height: 400,
          objectFit: "contain",
          borderTopLeftRadius: "18px",
          borderTopRightRadius: "18px",
          backgroundColor: "#111",
          flexShrink: 0,
          marginBottom: "1rem",
        }}
        className="movie-poster"
      />
      <div className="card-body d-flex flex-column justify-content-between flex-grow-1">
        <div>
          <h5 className="card-title">{movie.title}</h5>
          <p className="mb-1">
            <span className="badge bg-secondary">Year: {movie.year}</span>
          </p>
          <p className="card-text text-light fw-semibold">{movie.genre}</p>
        </div>
        {token && (
          <button
            className={`btn ${isInWatchlist ? "btn-danger" : "btn-success"} w-100 mt-3`}
            onClick={handleWatchlistToggle}
          >
            {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default MovieCard;
