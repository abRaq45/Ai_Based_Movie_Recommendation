import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieCard from "../Components/MovieCard";

const RecommendationsPage = ({ user }) => {
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user || !user.token || !user.userId) {
        setError("You need to be logged in to see recommendations.");
        setLoading(false);
        return;
      }

      try {
        // 1. Get recommendation movie titles
        const recRes = await axios.get(
          `${API_BASE_URL}/api/users/${user.userId}/recommendations`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        const recommendedTitles = recRes.data.recommendations || [];

        // 2. Fetch movie details for each recommended title
        const movieDetailsPromises = recommendedTitles.map(title =>
          axios.get(`${API_BASE_URL}/api/movies/title/${encodeURIComponent(title)}`)
            .then(res => res.data)
            .catch(() => null) // ignore fetch errors for individual movies
        );

        const movies = await Promise.all(movieDetailsPromises);
        const validMovies = movies.filter(movie => movie !== null);

        setRecommendedMovies(validMovies);
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
        setError("Failed to load recommendations.");
      }
      setLoading(false);
    };

    fetchRecommendations();
  }, [user]);

  if (loading) return <h2 className="text-center mt-5 text-light">Loading recommendations...</h2>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;
  if (recommendedMovies.length === 0)
    return <p className="text-light text-center mt-5">No recommendations available.</p>;

  return (
    <div style={{ background: "linear-gradient(to right, #141E30, #243B55)", minHeight: "100vh" }}>
      <div className="container py-4">
        <h2 className="text-light mb-4">Recommended Movies For You</h2>
        <div className="row g-4">
          {recommendedMovies.map(movie => (
            <div key={movie.id || movie._id} className="col-md-4">
              <MovieCard movie={movie} userWatchlist={[]} setUserWatchlist={() => {}} user={user} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;
