package com.example.movieapi.Repository;

import com.example.movieapi.Entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    // Find a user by username
    Optional<User> findByUsername(String username);

    // Find a user by email
    Optional<User> findByEmail(String email);

    // Check if a username already exists
    boolean existsByUsername(String username);

    // Check if an email already exists
    boolean existsByEmail(String email);
}
