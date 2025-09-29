package com.example.movieapi.Repository;

import com.example.movieapi.Entity.MovieEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface MovieRepository extends MongoRepository<MovieEntry, String> {
    List<MovieEntry> findByGenreIgnoreCase(String genre);

    Optional<MovieEntry> findByTitleIgnoreCase(String title);

    // Matches even if genre is part of the string ("Crime" matches "Crime, Thriller")
    List<MovieEntry> findByGenreContainingIgnoreCase(String genre);
}
