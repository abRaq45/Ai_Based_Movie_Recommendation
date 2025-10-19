package com.example.movieapi.Service;

import com.example.movieapi.Entity.User;
import com.example.movieapi.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    // ➤ Signup user
    public User signUp(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("username already exists");
        }
//        if (userRepository.existsByEmail(user.getEmail())) {
//            throw new RuntimeException("email already exists");
//        }

        // Hash password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Default role
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            user.setRoles(List.of("ROLE_USER")); // ⚡ Add ROLE_ prefix
        }

        return userRepository.save(user);
    }

    // ➤ Login user
    public Optional<User> login(String username, String rawPassword) {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(rawPassword, user.getPassword())) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }

    // ➤ Add movie to watchlist
    public User addToWatchlist(String userId, String movieId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getWatchlist().contains(movieId)) {
            user.getWatchlist().add(movieId);
        }
        return userRepository.save(user);
    }

    // ➤ Remove movie from watchlist
    public User removeFromWatchlist(String userId, String movieId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.getWatchlist().remove(movieId);
        return userRepository.save(user);
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id " + id);
        }
        userRepository.deleteById(id);
    }
}
