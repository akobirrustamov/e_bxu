package com.example.backend.Controller;

import com.example.backend.Entity.*;
import com.example.backend.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/v1/curriculum-subject")
@RequiredArgsConstructor
public class CurriculumSubjectController {

    private final SubjectDetailsRepo subjectDetailsRepo;
    private final SubjectRepo subjectRepo;
    private final SubjectExamTypesRepo subjectExamTypesRepo;
    private final DepartmentRepo departmentRepo;
    private final com.example.backend.Service.ExternalApiService externalApiService;
    private final TokenHemisRepo tokenHemisRepo;
    private final CurriculumSubjectRepo curriculumSubjectRepo;





}
