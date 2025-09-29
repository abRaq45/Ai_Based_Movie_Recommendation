package com.example.movieapi.Controller;

import com.example.movieapi.Entity.MovieEntry;
import com.example.movieapi.Service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "*")
public class MovieController {

    @Autowired
    private MovieService movieService;

    // Add new movie
    @PostMapping
    public MovieEntry addMovie(@RequestBody MovieEntry movie) {
        return movieService.addMovie(movie);
    }

    // Get all movies
    @GetMapping
    public List<MovieEntry> getAllMovies() {
        return movieService.getAllMovies();
    }

    // Get movie by ID
    @GetMapping("/id/{id}")
    public Optional<MovieEntry> getMovieById(@PathVariable String id) {
        return movieService.getMovieById(id);
    }

    // Get movie by Title
    @GetMapping("/title/{title}")
    public Optional<MovieEntry> getMovieByTitle(@PathVariable String title) {
        return movieService.getMovieByTitle(title);
    }

    // Get movies by Genre
    @GetMapping("/genre/{genre}")
    public List<MovieEntry> getMoviesByGenre(@PathVariable String genre) {
        return movieService.getMoviesByGenre(genre);
    }


    // Delete movie by ID
    @DeleteMapping("/{id}")
    public String deleteById(@PathVariable String id) {
        movieService.deleteMovie(id);
        return "Movie with ID " + id + " deleted successfully!";
    }

    //update mapping
    @PutMapping("/{id}")
    public MovieEntry updateMovie(@PathVariable String id , @RequestBody MovieEntry updatedMovie){
        return movieService.updateMovie(id, updatedMovie);
    }
}
