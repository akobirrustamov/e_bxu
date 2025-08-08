package com.example.backend.Controller;

import com.example.backend.DTO.TeacherCurriculumsDTO;
import com.example.backend.Entity.Curriculum;
import com.example.backend.Entity.TeacherCurriculumSubject;
import com.example.backend.Entity.User;
import com.example.backend.Repository.CurriculumSubjectRepo;
import com.example.backend.Repository.TeacherCurriculumRepo;
import com.example.backend.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/v1/teacher-curriculum-subject")
@RequiredArgsConstructor
public class TeacherCurriculumController {
    private final TeacherCurriculumRepo teacherCurriculumRepo;
    private final CurriculumSubjectRepo curriculumRepo;
    private final UserRepo userRepo;






}
