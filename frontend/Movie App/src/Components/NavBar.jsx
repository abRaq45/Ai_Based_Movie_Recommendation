import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const GENRES = [
  { label: "All", value: "" },
  { label: "Action", value: "Action" },
  { label: "Adventure", value: "Adventure" },
  { label: "Comedy", value: "Comedy" },
  { label: "Crime", value: "Crime" },
  { label: "Drama", value: "Drama" },
  { label: "Fantasy", value: "Fantasy" },
  { label: "Horror", value: "Horror" },
  { label: "Romance", value: "Romance" },
  { label: "Sci-Fi", value: "Sci-Fi" },
  { label: "Thriller", value: "Thriller" },
  { label: "Animation", value: "Animation" },
  { label: "War", value: "War" },
  { label: "Apocalypse", value: "Apocalypse" },
  { label: "History", value: "History" },
  { label: "Biography", value: "Biography" },
  { label: "Mystery", value: "Mystery" },
  { label: "Documentary", value: "Documentary" },
  { label: "Western", value: "Western" },
  { label: "Sports", value: "Sport" }
];

const Navbar = ({ user, setUser, setGenre, setSearch }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (setSearch) setSearch(searchQuery);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-lg">
      <style>
        {`
          .navbar-search-modern {
            position: relative;
            margin-left: 24px;
            margin-right: 24px;
            width: 300px;
            display: flex;
            align-items: center;
          }
          .navbar-search-modern input {
            width: 100%;
            border-radius: 25px;
            padding: 10px 10px 10px 38px;
            background: #222;
            color: #fff;
            border: 1px solid #333;
            font-size: 1rem;
            transition: box-shadow 0.2s;
          }
          .navbar-search-modern input:focus {
            box-shadow: 0 0 8px #ff6161;
            border-color: #ff6161;
            outline: none;
          }
          .search-icon {
            position: absolute;
            left: 13px;
            color: #888;
            font-size: 1.1rem;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
          }
          .dropdown-menu .dropdown-item:hover {
            background-color: #f0f0f0;
            color: #111 !important;
          }
        `}
      </style>
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-danger fs-3" to="/">
          🎬 MovieApp
        </Link>

        {/* Modern Search Bar - Left Side */}
        <form className="navbar-search-modern" onSubmit={handleSearch}>
          <span className="search-icon">
            <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="7" stroke="#888" strokeWidth="2" />
              <line x1="13.1213" y1="13.1213" x2="17" y2="17" stroke="#888" strokeWidth="2" />
            </svg>
          </span>
          <input
            type="search"
            className="form-control"
            value={searchQuery}
            placeholder="Search by title, year, genre"
            onChange={e => setSearchQuery(e.target.value)}
          />
        </form>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item dropdown me-3">
              <button
                className="nav-link dropdown-toggle btn btn-danger px-3 py-2 fw-bold"
                id="genreDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                type="button"
              >
                🎭 Genres
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end shadow"
                aria-labelledby="genreDropdown"
                style={{ backgroundColor: "#1c1c1c" }}
              >
                {GENRES.map((genre) => (
                  <li key={genre.value}>
                    <button
                      className="dropdown-item fw-semibold text-light"
                      type="button"
                      onClick={() => setGenre(genre.value)}
                    >
                      {genre.label}
                    </button>
                  </li>
                ))}
              </ul>
            </li>

            {/* Home Button */}
            <li className="nav-item me-2">
              <button
                className="btn btn-outline-primary"
                type="button"
                onClick={() => navigate("/")}
              >
                Home
              </button>
            </li>

            {/* Recommendations Button - Visible only when logged in */}
            {isLoggedIn && (
              <li className="nav-item me-2">
                <button
                  className="btn btn-outline-warning"
                  type="button"
                  onClick={() => navigate("/recommendations")}
                >
                  Recommendations
                </button>
              </li>
            )}

            {isLoggedIn ? (
              <>
                <li className="nav-item me-2">
                  <button
                    className="btn btn-outline-info"
                    type="button"
                    onClick={() => navigate("/watchlist")}
                  >
                    Watchlist
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger"
                    type="button"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-2">
                  <button
                    className="btn btn-outline-light"
                    type="button"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-success"
                    type="button"
                    onClick={() => navigate("/signup")}
                  >
                    Signup
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
