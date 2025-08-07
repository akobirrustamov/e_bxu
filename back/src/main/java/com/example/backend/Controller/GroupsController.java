package com.example.backend.Controller;

import com.example.backend.Entity.Groups;
import com.example.backend.Entity.TokenHemis;
import com.example.backend.Repository.GroupsRepo;
import com.example.backend.Repository.TokenHemisRepo;
import com.example.backend.Service.ExternalApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

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
}
