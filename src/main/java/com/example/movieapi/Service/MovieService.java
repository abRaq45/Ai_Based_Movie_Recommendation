package com.example.movieapi.Service;

import com.example.movieapi.Entity.MovieEntry;
import com.example.movieapi.Repository.MovieRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public List<MovieEntry> getAllMovies() {
        return movieRepository.findAll();
    }

    // Matches even if genre is part of the string ("Crime" matches "Crime, Thriller")
    public List<MovieEntry> getMoviesByGenre(String genre) {
        return movieRepository.findByGenreContainingIgnoreCase(genre);
    }

    public MovieEntry addMovie(MovieEntry movie) {
        return movieRepository.save(movie);
    }

    public Optional<MovieEntry> getMovieById(String id) {
        return movieRepository.findById(id);
    }

    public void deleteMovie(String id) {
        movieRepository.deleteById(id);
    }

    public Optional<MovieEntry> getMovieByTitle(String title) {
        return movieRepository.findByTitleIgnoreCase(title);
    }

    public MovieEntry updateMovie(String id , MovieEntry updatedMovie) {
        return movieRepository.findById(id).map(existingMovie -> {
            existingMovie.setTitle(updatedMovie.getTitle());
            existingMovie.setGenre(updatedMovie.getGenre());
            existingMovie.setYear(updatedMovie.getYear());
            existingMovie.setPosterUrl(updatedMovie.getPosterUrl());
            return movieRepository.save(existingMovie);
        }).orElseThrow(() -> new RuntimeException("Movie not found with id " + id));
    }
}
