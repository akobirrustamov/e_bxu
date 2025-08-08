package com.example.backend.Controller;

import com.example.backend.Entity.Curriculum;
import com.example.backend.Entity.Specialty;
import com.example.backend.Repository.CurriculumRepo;
import com.example.backend.Repository.SpecialtyRepo;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/curriculum")
@RequiredArgsConstructor
public class CurriculumController {

    private final CurriculumRepo curriculumRepo;
    private final SpecialtyRepo specialtyRepo;

    @GetMapping("/update")
    public HttpEntity<?> updateCurriculum() {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            HttpClient client = HttpClient.newHttpClient();

            int page = 1;
            int totalPages = 1;
            List<Curriculum> savedList = new ArrayList<>();

            do {
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create("https://student.buxpxti.uz/rest/v1/data/curriculum-list?page=" + page))
                        .GET()
                        .build();

                HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
                JsonNode root = objectMapper.readTree(response.body());

                JsonNode data = root.get("data");
                JsonNode items = data.get("items");
                JsonNode pagination = data.get("pagination");
                totalPages = pagination.get("pageCount").asInt();

                for (JsonNode item : items) {
                    int hemisId = item.get("id").asInt();
                    if (curriculumRepo.findByHemisId(hemisId).isPresent()) continue;

                    JsonNode specialtyNode = item.get("specialty");
                    Integer specialtyCode = Integer.valueOf(specialtyNode.get("id").asText());
                    Optional<Specialty> byHemisId = specialtyRepo.findByHemisId(specialtyCode);

                    if (byHemisId.isEmpty()) continue;
                    Specialty specialty = byHemisId.get();

                    Curriculum c = Curriculum.builder()
                            .hemisId(hemisId)
                            .specialty(specialty)
                            .educationYearCode(item.get("educationYear").get("code").asInt())
                            .educationYearName(item.get("educationYear").get("name").asText())
                            .educationTypeName(item.get("educationType").get("name").asText())
                            .education_period(item.get("education_period").asInt())
                            .semester_count(item.get("semester_count").asInt())
                            .created(LocalDateTime.now())
                            .build();

                    savedList.add(curriculumRepo.save(c));
                }

                page++;
            } while (page <= totalPages);

            return ResponseEntity.ok("✅ Saved " + savedList.size() + " new curriculum records.");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("❌ Error: " + e.getMessage());
        }
    }
}
