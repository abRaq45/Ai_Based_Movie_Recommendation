import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./Components/NavBar";
import HomePage from "./Pages/HomePage";
import WatchlistPage from "./Pages/WatchlistPage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import RecommendationsPage from "./Pages/RecommendationsPage"; // Import the new page

function App() {
  const [user, setUser] = useState(null);
  const [genre, setGenre] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    if (token && userId && username) {
      setUser({ userId, username, token });
    }
  }, []);

  return (
    <Router>
      <Navbar
        user={user}
        setUser={setUser}
        setGenre={setGenre}
        setSearch={setSearchQuery}  // Pass search setter here
      />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              user={user}
              setUser={setUser}
              selectedGenre={genre}
              searchQuery={searchQuery}  // Pass current search query here
            />
          }
        />
        <Route
          path="/watchlist"
          element={user ? <WatchlistPage user={user} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/recommendations"
          element={
            user ? <RecommendationsPage user={user} /> : <Navigate to="/login" replace />
          }
        />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="*"
          element={
            <h2 className="text-center mt-5 text-light">
              Page Not Found
            </h2>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
