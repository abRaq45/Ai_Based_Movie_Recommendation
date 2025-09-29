package com.example.movieapi.Controller;

import com.example.movieapi.Entity.User;
import com.example.movieapi.Entity.MovieEntry;
import com.example.movieapi.Service.AIRecommendationService;
import com.example.movieapi.Service.UserService;
import com.example.movieapi.Repository.MovieRepository;
import com.example.movieapi.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private MovieRepository movieRepository;
    @Autowired
    private AIRecommendationService aiRecommendationService;

    // SIGNUP
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            userService.signUp(user);
            return ResponseEntity.ok(Map.of("message", "User registered successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");

        return userService.login(username, password)
                .map(user -> {
                    String token = jwtUtil.generateToken(user.getUsername());
                    return ResponseEntity.ok(Map.of(
                            "userId", user.getId(),
                            "username", user.getUsername(),
                            "roles", user.getRoles(),
                            "token", token
                    ));
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid username or password")));
    }

    // GET USER BY ID
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable String userId,
                                         @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("error", "Missing or invalid token"));
        }
        String token = authHeader.substring(7);
        String username = jwtUtil.extractUsername(token);

        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getUsername().equals(username)) {
            return ResponseEntity.status(403).body(Map.of("error", "Unauthorized"));
        }

        return ResponseEntity.ok(user);
    }

    // DELETE USER
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    // Add movie to watchlist
    @PostMapping("/{userId}/watchlist/{movieId}")
    public ResponseEntity<?> addToWatchlist(@PathVariable String userId, @PathVariable String movieId) {
        String currentUser = getCurrentUsername();
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getUsername().equals(currentUser)) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        return ResponseEntity.ok(userService.addToWatchlist(userId, movieId));
    }

    // Remove movie from watchlist
    @DeleteMapping("/{userId}/watchlist/{movieId}")
    public ResponseEntity<?> removeFromWatchlist(@PathVariable String userId, @PathVariable String movieId) {
        String currentUser = getCurrentUsername();
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getUsername().equals(currentUser)) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        return ResponseEntity.ok(userService.removeFromWatchlist(userId, movieId));
    }

    // GET full watchlist (returns MovieEntry objects)
    @GetMapping("/{userId}/watchlist")
    public ResponseEntity<?> getWatchlist(@PathVariable String userId,
                                          @RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("error","Missing or invalid token"));
        }

        String token = authHeader.substring(7);
        String username = jwtUtil.extractUsername(token);

        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getUsername().equals(username)) {
            return ResponseEntity.status(403).body(Map.of("error","Unauthorized"));
        }

        // Fetch full MovieEntry objects for the user's watchlist
        List<MovieEntry> watchlistMovies = user.getWatchlist().stream()
                .map(movieId -> movieRepository.findById(movieId).orElse(null))
                .filter(movie -> movie != null)
                .collect(Collectors.toList());

        return ResponseEntity.ok(watchlistMovies);
    }

    // Helper to get currently authenticated username
    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }


    @GetMapping("/{userId}/recommendations")
    public ResponseEntity<?> getRecommendations(@PathVariable String userId,
                                                @RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("error", "Missing or invalid token"));
        }

        String token = authHeader.substring(7);
        String username = jwtUtil.extractUsername(token);

        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getUsername().equals(username)) {
            return ResponseEntity.status(403).body(Map.of("error", "Unauthorized"));
        }

        List<String> watchlistMovieTitles = user.getWatchlist().stream()
                .map(movieId -> movieRepository.findById(movieId))
                .filter(Optional::isPresent)
                .map(optMovie -> optMovie.get().getTitle())
                .toList();

        List<String> recommendations = aiRecommendationService.getRecommendationsBasedOnWatchlist(watchlistMovieTitles);

        return ResponseEntity.ok(Map.of("recommendations", recommendations));
    }
}
