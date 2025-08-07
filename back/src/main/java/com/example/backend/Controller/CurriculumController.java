package com.example.backend.Controller;

import com.example.backend.Entity.Department;
import com.example.backend.Entity.Subject;
import com.example.backend.Entity.SubjectExamTypes;
import com.example.backend.Entity.TokenHemis;
import com.example.backend.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/curriculum")
@RequiredArgsConstructor
public class CurriculumController {

    private final CurriculumRepo curriculumRepo;
    private final SubjectDetailsRepo subjectDetailsRepo;
    private final SubjectRepo subjectRepo;
    private final SubjectExamTypesRepo subjectExamTypesRepo;
    private final DepartmentRepo departmentRepo;

    private final com.example.backend.Service.ExternalApiService externalApiService;
    private final TokenHemisRepo tokenHemisRepo;
    @GetMapping
    public HttpEntity<?> getCurriculum(){
        return new ResponseEntity<>(curriculumRepo.findAll(), HttpStatus.OK);
    }


    @GetMapping("/update")
    public HttpEntity<?> updateCurriculum(){

        System.out.println("\u25B6\uFE0F Starting curriculum update...");

        List<TokenHemis> all = tokenHemisRepo.findAll();
        if (all.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("\u274C Token not found");
        }
        String token = all.get(all.size() - 1).getName();
        System.out.println("\ud83d\udd11 Token: " + token);

        int page = 1;
        int totalCount = 0;
        int savedCount = 0;

        try {
            do {
                System.out.println("\u2794 Requesting page: " + page);
                ResponseEntity<?> response = externalApiService.sendRequest(
                        "v1/data/curriculum-subject-list",
                        HttpMethod.GET,
                        Map.of("Authorization", "Bearer " + token),
                        Map.of("page", page, "l", "uz-UZ"),
                        null
                );


            } while (true);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("\u274C Exception: " + e.getMessage());
        }


    }




}
