package com.example.backend.Controller;

import com.example.backend.DTO.TeacherCurriculumsDTO;
import com.example.backend.Entity.Curriculum;
import com.example.backend.Entity.TeacherCurriculum;
import com.example.backend.Entity.User;
import com.example.backend.Repository.CurriculumRepo;
import com.example.backend.Repository.TeacherCurriculumRepo;
import com.example.backend.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/teacher-curriculum")
@RequiredArgsConstructor
public class TeacherCurriculumController {
    private final TeacherCurriculumRepo teacherCurriculumRepo;
    private final CurriculumRepo curriculumRepo;
    private final UserRepo userRepo;

    @GetMapping
    public ResponseEntity<?> getAllCurriculum() {
        return ResponseEntity.ok(teacherCurriculumRepo.findAllNative());
    }

    @PostMapping
    public ResponseEntity<?> addTeacherCurriculums(@RequestBody TeacherCurriculumsDTO dto) {
        Optional<User> teacherOpt = userRepo.findById(dto.getTeacherId());
        if (teacherOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Teacher not found");
        }

        User teacher = teacherOpt.get();
        List<TeacherCurriculum> savedList = new ArrayList<>();

        for (UUID curriculumId : dto.getCurriculumIds()) {
            Optional<Curriculum> curriculumOpt = curriculumRepo.findById(curriculumId);
            if (curriculumOpt.isEmpty()) continue;

            Curriculum curriculum = curriculumOpt.get();
            TeacherCurriculum entity = TeacherCurriculum.builder()
                    .teacher(teacher)
                    .curriculum(curriculum)
                    .created(LocalDateTime.now())
                    .build();
            savedList.add(teacherCurriculumRepo.save(entity));
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(savedList);
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<?> getByTeacher(@PathVariable UUID teacherId) {
        return ResponseEntity.ok(teacherCurriculumRepo.findByTeacherIdNative(teacherId));
    }

    @GetMapping("/curriculum/{curriculumId}")
    public ResponseEntity<?> getByCurriculum(@PathVariable UUID curriculumId) {
        return ResponseEntity.ok(teacherCurriculumRepo.findByCurriculumIdNative(curriculumId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable UUID id, @RequestBody TeacherCurriculumsDTO dto) {
        Optional<TeacherCurriculum> opt = teacherCurriculumRepo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        TeacherCurriculum tc = opt.get();
        if (dto.getTeacherId() != null) {
            userRepo.findById(dto.getTeacherId()).ifPresent(tc::setTeacher);
        }
        if (dto.getCurriculumIds() != null && !dto.getCurriculumIds().isEmpty()) {
            curriculumRepo.findById(dto.getCurriculumIds().get(0)).ifPresent(tc::setCurriculum);
        }
        return ResponseEntity.ok(teacherCurriculumRepo.save(tc));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        if (!teacherCurriculumRepo.existsById(id)) return ResponseEntity.notFound().build();
        teacherCurriculumRepo.deleteById(id);
        return ResponseEntity.ok("Deleted successfully");
    }
}
