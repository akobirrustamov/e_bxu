package com.example.backend.Service;

import com.example.backend.Entity.TokenHemis;
import com.example.backend.Repository.TokenHemisRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExternalApiService {

    private final RestTemplate restTemplate;
    private final TokenHemisRepo tokenHemisRepo;

    private static final String BASE_URL = "https://student.buxpxti.uz/rest/";

    public ResponseEntity<?> sendRequest(
            String endpoint,                          // e.g. "v1/data/group-list"
            HttpMethod method,                        // e.g. HttpMethod.GET
            Map<String, String> headers,              // additional headers
            Map<String, Object> queryParams,          // URL params like ?page=1
            Object body                               // POST body (can be null)
    ) {
        // 1. Get latest token from DB
        List<TokenHemis> allTokens = tokenHemisRepo.findAll();
        if (allTokens.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No token available");
        }
        String token = allTokens.get(allTokens.size() - 1).getName();

        // 2. Build full URL with parameters
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(BASE_URL + endpoint);
        if (queryParams != null) {
            queryParams.forEach(builder::queryParam);
        }
        String fullUrl = builder.toUriString();

        // 3. Set headers
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        httpHeaders.setBearerAuth(token);
        if (headers != null) {
            headers.forEach(httpHeaders::set);
        }

        HttpEntity<Object> requestEntity = new HttpEntity<>(body, httpHeaders);

        // 4. Make request
        try {
            return restTemplate.exchange(fullUrl, method, requestEntity, Object.class);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("API request error: " + e.getMessage());
        }
    }
}
