import React, { useEffect, useState } from "react";
import MovieCard from "../Components/MovieCard";
import axios from "axios";

const WatchlistPage = ({ user }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!user || !user.token || !user.userId) {
        setWatchlist([]);
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/users/${user.userId}/watchlist`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setWatchlist(res.data);
      } catch (err) {
        console.error("Failed to fetch watchlist:", err);
        setWatchlist([]);
      }
      setLoading(false);
    };

    fetchWatchlist();
  }, [user]);

  if (loading) return <h2 className="text-center mt-5 text-light">Loading...</h2>;

  return (
    <div style={{ background: "linear-gradient(to right, #141E30, #243B55)", minHeight: "100vh" }}>
      <div className="container py-4">
        <h2 className="text-light mb-4">My Watchlist</h2>
        {watchlist.length === 0 ? (
          <p className="text-light">Your watchlist is empty.</p>
        ) : (
          <div className="row">
            {watchlist.map((movie) => (
              <div key={movie._id} className="col-md-4 mb-4">
                <MovieCard
                  movie={movie}
                  userWatchlist={watchlist.map((m) => m._id)}
                  setUserWatchlist={setWatchlist}
                  user={user}
                  isInWatchlist={true} // Explicitly mark as in watchlist
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;
