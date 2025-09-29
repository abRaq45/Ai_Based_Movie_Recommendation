package com.example.movieapi.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AIRecommendationService {

    private final WebClient webClient;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public AIRecommendationService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://generativelanguage.googleapis.com").build();
    }

    public List<String> getRecommendationsBasedOnWatchlist(List<String> watchlistTitles) {
        if (watchlistTitles.isEmpty()) {
            return Collections.emptyList();
        }

        // Improved prompt for Gemini
        String prompt = "User watched these movies: " + String.join(", ", watchlistTitles) +
                ". Please provide a list of 5 popular movie titles they might like next, each on a separate line.";

        System.out.println("Prompt sent: " + prompt);

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of("text", prompt)
                                )
                        )
                )
        );

        Map response;
        try {
            response = webClient.post()
                    .uri("/v1beta/models/gemini-2.0-flash:generateContent")
                    .header("Content-Type", "application/json")
                    .header("X-goog-api-key", geminiApiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            System.out.println("Full Gemini API response: " + response);
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }

        return parseGeminiResponse(response);
    }

    private List<String> parseGeminiResponse(Map response) {
        try {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> firstCandidate = candidates.get(0);
                Map<String, Object> content = (Map<String, Object>) firstCandidate.get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                if (parts != null && !parts.isEmpty()) {
                    String text = (String) parts.get(0).get("text");
                    if (text == null || text.isBlank()) {
                        System.out.println("Empty text inside parts in Gemini response.");
                        return Collections.emptyList();
                    }

                    // Split lines, trim, clean numbering
                    return Arrays.stream(text.split("\\r?\\n"))
                            .map(String::trim)
                            .filter(s -> !s.isEmpty())
                            .map(line -> line.replaceAll("^[0-9\\.\\-\\)\\s]+", ""))
                            .collect(Collectors.toList());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return Collections.emptyList();
    }

}
