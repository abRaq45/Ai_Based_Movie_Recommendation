package com.example.movieapi.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
@Document(collection = "movies") // MongoDB collection name
public class MovieEntry {

    @Id
    private String id;      // MongoDB document ID
    private String title;
    private String genre;

    private String year;
    private String posterUrl;

    // Default constructor
    public MovieEntry() {}

    // Parameterized constructor
    public MovieEntry(String title, String genre, String year, String posterUrl) {
        this.title = title;
        this.genre = genre;
        this.year = year;
        this.posterUrl = posterUrl;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }
}
