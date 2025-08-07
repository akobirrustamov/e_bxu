package com.example.backend.Controller;

import com.example.backend.Entity.Curriculum;
import com.example.backend.Entity.Lesson;
import com.example.backend.Entity.TokenHemis;
import com.example.backend.Repository.CurriculumRepo;
import com.example.backend.Repository.LessonRepo;
import com.example.backend.Repository.TokenHemisRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@CrossOrigin
@RequestMapping("/api/v1/lessons")
public class LessonController {
    private final LessonRepo lessonRepo;
    private final CurriculumRepo curriculumRepo;
    private final TokenHemisRepo tokenHemisRepo;
    private final com.example.backend.Service.ExternalApiService externalApiService;
    @GetMapping("/update/{curriculumId}")
    public HttpEntity<?> updateLesson(@PathVariable UUID curriculumId) {


        Optional<Curriculum> byId = curriculumRepo.findById(curriculumId);
        if (byId.isPresent()) {
          return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        Curriculum curriculum = byId.get();

        System.out.println("\u25B6\uFE0F Starting lesson update...");

        List<TokenHemis> all = tokenHemisRepo.findAll();
        if (all.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("\u274C Token not found");
        }

        String token = all.get(all.size() - 1).getName();
        System.out.println("\ud83d\udd11 Token: " + token);

        try {
            ResponseEntity<?> response = externalApiService.sendRequest(
                    "v1/data/curriculum-subject-topic-list",
                    HttpMethod.GET,
                    Map.of("Authorization", "Bearer " + token),
                    Map.of("curriculum", curriculum.getHemisId()),
                    null
            );

            if (!(response.getBody() instanceof Map)) {
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body("Invalid response from external service");
            }

            Map<String, Object> body = (Map<String, Object>) response.getBody();
            if (!(Boolean.TRUE.equals(body.get("success")))) {
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body("API returned failure: " + body.get("error"));
            }

            Map<String, Object> data = (Map<String, Object>) body.get("data");
            List<Map<String, Object>> items = (List<Map<String, Object>>) data.get("items");
            if (items == null || items.isEmpty()) {
                return ResponseEntity.ok("No lessons found for curriculum ID: " + curriculumId);
            }

//            Optional<Curriculum> optionalCurriculum = curriculumRepo.findByHemisId(curriculum.getHemisId());
//            if (optionalCurriculum.isEmpty()) {
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("❌ Curriculum not found for ID: " + curriculumId);
//            }
//            Curriculum curriculum = optionalCurriculum.get();

            int savedCount = 0;

            for (Map<String, Object> item : items) {
                Integer hemisId = (Integer) item.get("id");
                if (lessonRepo.findByHemisId(hemisId).isPresent()) continue;

                String name = (String) item.get("name");
                Integer topic_load = (Integer) item.get("topic_load");
                Integer position = (Integer) item.get("position");
                Boolean active = (Boolean) item.get("active");
                Integer department = (Integer) item.get("_department");
                Integer semester = Integer.parseInt(item.get("_semester").toString());
                Integer trainingType = Integer.parseInt(item.get("_training_type").toString());
                Long createdAt = ((Number) item.get("created_at")).longValue();
                Long updatedAt = ((Number) item.get("updated_at")).longValue();

                Lesson lesson = Lesson.builder()
                        .hemisId(hemisId)
                        .name(name)
                        .topic_load(topic_load)
                        .position(position)
                        .active(active)
                        .department(department)
                        .semester(semester)
                        .trainingType(trainingType)
                        .createdAt(createdAt)
                        .updatedAt(updatedAt)
                        .created(LocalDateTime.now())
                        .curriculum(curriculum)
                        .isMy(false)
                        .build();

                lessonRepo.save(lesson);
                savedCount++;
            }

            return ResponseEntity.ok("✅ Lessons updated successfully. Total saved: " + savedCount);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("❌ Exception: " + e.getMessage());
        }
    }




    @GetMapping("/{curriculumId}")
    public HttpEntity<?> getCurriculum(@PathVariable UUID curriculumId) {
        List<Lesson> lessons = lessonRepo.findByIdCurriculm(curriculumId);
        return ResponseEntity.ok(lessons);
    }

}
