package com.example.backend.Controller;

import com.example.backend.Entity.Curriculum;
import com.example.backend.Entity.Lesson;
import com.example.backend.Entity.TokenHemis;
import com.example.backend.Repository.CurriculumSubjectRepo;
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
    private final CurriculumSubjectRepo curriculumRepo;
    private final TokenHemisRepo tokenHemisRepo;
    private final com.example.backend.Service.ExternalApiService externalApiService;





}
