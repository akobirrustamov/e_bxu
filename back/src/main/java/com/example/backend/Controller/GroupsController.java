package com.example.backend.Controller;

import com.example.backend.Entity.Groups;
import com.example.backend.Entity.Student;
import com.example.backend.Entity.TokenHemis;
import com.example.backend.Repository.GroupsRepo;
import com.example.backend.Repository.StudentRepo;
import com.example.backend.Repository.TokenHemisRepo;
import com.example.backend.Service.ExternalApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin
@RequestMapping("/api/v1/groups")
public class GroupsController {

    private final GroupsRepo groupsRepo;
    private final ExternalApiService externalApiService;
    private final TokenHemisRepo tokenHemisRepo;
    private final StudentRepo studentRepo;
    @GetMapping
    public ResponseEntity<?> getGroups() {
        List<Groups> all = groupsRepo.findAll();
        return ResponseEntity.ok(all);
    }


    @GetMapping("/{groupId}")
    public ResponseEntity<?> getGroupById(@PathVariable UUID groupId) {
        return groupsRepo.findById(groupId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/update")
    public ResponseEntity<?> updateGroupsFromExternal() {
        System.out.println("▶️ Starting group update...");

        int page = 1;
        int maxPages = 150;
        int savedCount = 0;

        // 1. Get token from DB
        List<TokenHemis> all = tokenHemisRepo.findAll();
        if (all.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Token not found");
        }
        String token = all.get(all.size() - 1).getName();
        System.out.println("🔑 Token: " + token);

        Map<String, String> headers = Map.of("Authorization", "Bearer " + token);

        try {
            while (page <= maxPages) {
                System.out.println("➡️ Requesting page: " + page);
                ResponseEntity<?> response = externalApiService.sendRequest(
                        "v1/data/group-list",
                        HttpMethod.GET,
                        headers,
                        Map.of("page", page, "l", "uz-UZ"),  // ✅ Added language param
                        null
                );

                System.out.println("📥 Response status: " + response.getStatusCode());
                if (response.getStatusCode().is2xxSuccessful() && response.getBody() instanceof Map) {
                    Map<String, Object> responseBody = (Map<String, Object>) response.getBody();

                    Boolean success = (Boolean) responseBody.get("success");
                    if (!Boolean.TRUE.equals(success)) {
                        String error = (String) responseBody.getOrDefault("error", "Unknown error");
                        return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                                .body("⚠️ API responded with error: " + error);
                    }

                    Map<String, Object> data = (Map<String, Object>) responseBody.get("data");
                    if (data != null && data.containsKey("items")) {
                        List<Map<String, Object>> items = (List<Map<String, Object>>) data.get("items");

                        for (Map<String, Object> groupData : items) {
                            Groups group = mapToGroupEntity(groupData);
                            if (!groupsRepo.findByHemisId(group.getHemisId()).isPresent()) {
                                groupsRepo.save(group);
                                savedCount++;
                            }
                        }
                    }

                    page++;
                } else {
                    return ResponseEntity.status(response.getStatusCode())
                            .body("❌ Failed on page " + page + ": " + response.getBody());
                }
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Exception while saving groups: " + e.getMessage());
        }

        return ResponseEntity.ok("✅ Groups sync complete. New groups saved: " + savedCount);
    }

    private Groups mapToGroupEntity(Map<String, Object> groupData) {
        String name = (String) groupData.get("name");
        Integer hemisId = (Integer) groupData.get("id");

        String departmentName = extractNestedField(groupData, "department", "name");
        Integer departmentId = null;

        if (groupData.containsKey("department") && groupData.get("department") instanceof Map) {
            Map<String, Object> departmentMap = (Map<String, Object>) groupData.get("department");
            if (departmentMap.containsKey("id")) {
                Object idObj = departmentMap.get("id");
                departmentId = (idObj instanceof Integer) ? (Integer) idObj : Integer.parseInt(idObj.toString());
            }
        }

        String specialtyName = extractNestedField(groupData, "specialty", "name");

        return new Groups(hemisId, name, departmentId, departmentName, specialtyName, LocalDateTime.now());
    }

    private String extractNestedField(Map<String, Object> data, String field, String subField) {
        if (data.containsKey(field)) {
            Object fieldObj = data.get(field);
            if (fieldObj instanceof Map) {
                Map<String, Object> nested = (Map<String, Object>) fieldObj;
                if (nested.containsKey(subField)) {
                    return (String) nested.get(subField);
                }
            }
        }
        return null;
    }





    @GetMapping("/update-students/{groupId}")
    public ResponseEntity<?> updateGroupStudents(@PathVariable UUID groupId) {
        Optional<Groups> groupOptional = groupsRepo.findById(groupId);
        if (groupOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Group not found");
        }

        Groups group = groupOptional.get();
        List<TokenHemis> all = tokenHemisRepo.findAll();
        if (all.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Token not found");
        }

        String token = all.get(all.size() - 1).getName();
        Map<String, String> headers = Map.of("Authorization", "Bearer " + token);

        try {
            ResponseEntity<?> response = externalApiService.sendRequest(
                    "v1/data/student-list",
                    HttpMethod.GET,
                    headers,
                    Map.of("_group", group.getHemisId()),
                    null
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() instanceof Map) {
                Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
                if (!Boolean.TRUE.equals(responseBody.get("success"))) {
                    return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body("API error: " + responseBody.get("error"));
                }

                List<Map<String, Object>> items = (List<Map<String, Object>>)
                        ((Map<String, Object>) responseBody.get("data")).get("items");

                int savedCount = 0;
                for (Map<String, Object> item : items) {
                    Integer hemisId = (Integer) item.get("id");
                    Optional<Student> existing = studentRepo.findByHemisId(hemisId);
                    if (existing.isPresent()) continue;

                    Student student = Student.builder()
                            .hemisId(hemisId)
                            .metaId((Integer) item.get("meta_id"))
                            .fullName((String) item.get("full_name"))
                            .shortName((String) item.get("short_name"))
                            .firstName((String) item.get("first_name"))
                            .secondName((String) item.get("second_name"))
                            .thirdName((String) item.get("third_name"))
                            .gender(extractNested(item, "gender", "name"))
                            .birthDate(Long.valueOf(item.get("birth_date").toString()))
                            .studentIdNumber((String) item.get("student_id_number"))
                            .image((String) item.get("image"))
                            .avgGpa(getDouble(item.get("avg_gpa")))
                            .avgGrade(getDouble(item.get("avg_grade")))
                            .totalCredit(getInt(item.get("total_credit")))
                            .country(extractNested(item, "country", "name"))
                            .province(extractNested(item, "province", "name"))
                            .currentProvince(extractNested(item, "currentProvince", "name"))
                            .district(extractNested(item, "district", "name"))
                            .currentDistrict(extractNested(item, "currentDistrict", "name"))
                            .terrain(extractNested(item, "terrain", "name"))
                            .currentTerrain(extractNested(item, "currentTerrain", "name"))
                            .citizenship(extractNested(item, "citizenship", "name"))
                            .studentStatus(extractNested(item, "studentStatus", "name"))
                            .curriculumId(getInt(item.get("_curriculum")))
                            .educationForm(extractNested(item, "educationForm", "name"))
                            .educationType(extractNested(item, "educationType", "name"))
                            .paymentForm(extractNested(item, "paymentForm", "name"))
                            .studentType(extractNested(item, "studentType", "name"))
                            .socialCategory(extractNested(item, "socialCategory", "name"))
                            .accommodation(extractNested(item, "accommodation", "name"))
                            .departmentName(extractNested(item, "department", "name"))
                            .specialtyName(extractNested(item, "specialty", "name"))
                            .groupName(extractNested(item, "group", "name"))
                            .groupLang(extractNested(item, "group.educationLang", "name"))
                            .level(extractNested(item, "level", "name"))
                            .levelName(extractNested(item, "educationYear", "name"))
                            .semester(extractNested(item, "semester", "code"))
                            .semesterName(extractNested(item, "semester", "name"))
                            .educationYear(extractNested(item, "educationYear", "name"))
                            .yearOfEnter(getInt(item.get("year_of_enter")))
                            .roommateCount(getInt(item.get("roommate_count")))
                            .isGraduate(Boolean.TRUE.equals(item.get("is_graduate")))
                            .totalAcload(getInt(item.get("total_acload")))
                            .other((String) item.get("other"))
                            .validateUrl((String) item.get("validateUrl"))
                            .email((String) item.get("email"))
                            .hash((String) item.get("hash"))
                            .group(group)
                            .build();

                    studentRepo.save(student);
                    savedCount++;
                }
                return ResponseEntity.ok("✅ Students saved: " + savedCount);

            } else {
                return ResponseEntity.status(response.getStatusCode()).body("❌ API error: " + response.getBody());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Exception occurred: " + e.getMessage());
        }
    }

    private String extractNested(Map<String, Object> data, String key, String subKey) {
        if (!data.containsKey(key)) return null;
        Object obj = data.get(key);
        if (obj instanceof Map<?, ?> map && map.containsKey(subKey)) {
            return String.valueOf(map.get(subKey));
        }
        return null;
    }

    private Double getDouble(Object val) {
        if (val == null) return null;
        return Double.parseDouble(val.toString());
    }

    private Integer getInt(Object val) {
        if (val == null) return null;
        return Integer.parseInt(val.toString());
    }

}
