package com.example.movieapi.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AIRecommendationService {

    private final WebClient webClient;

    @Value("${openrouter.api.key}")
    private String openRouterApiKey;

    public AIRecommendationService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .baseUrl("https://openrouter.ai/api/v1")
                .build();
    }

    public List<String> getRecommendationsBasedOnWatchlist(List<String> watchlistTitles) {

        if (watchlistTitles == null || watchlistTitles.isEmpty()) {
            return Collections.emptyList();
        }

        String prompt =
                "User watched these movies: " + String.join(", ", watchlistTitles) + ". " +
                        "Recommend 5 similar popular movies. " +
                        "Return only movie titles, one per line.";

        Map<String, Object> requestBody = Map.of(
                "model", "mistralai/mistral-7b-instruct",
                "messages", List.of(
                        Map.of(
                                "role", "user",
                                "content", prompt
                        )
                )
        );

        Map response;

        try {
            response = webClient.post()
                    .uri("/chat/completions")
                    .header("Authorization", "Bearer " + openRouterApiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            System.out.println("OpenRouter response: " + response);

        } catch (Exception e) {
            System.err.println("OpenRouter API failed");
            e.printStackTrace();
            return Collections.emptyList();
        }

        return parseResponse(response);
    }

    private List<String> parseResponse(Map response) {
        try {
            List<Map<String, Object>> choices =
                    (List<Map<String, Object>>) response.get("choices");

            if (choices == null || choices.isEmpty()) return Collections.emptyList();

            Map<String, Object> message =
                    (Map<String, Object>) choices.get(0).get("message");

            String text = (String) message.get("content");

            return Arrays.stream(text.split("\\r?\\n"))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .map(line -> line.replaceAll("^[0-9\\.\\-\\)\\s]+", ""))
                    .collect(Collectors.toList());

        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}
