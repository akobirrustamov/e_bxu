package com.example.backend.Controller;

import com.example.backend.Entity.*;
import com.example.backend.Repository.*;
import com.example.backend.Service.ExternalApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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
    private final CurriculumRepo curriculumRepo;
    private final CurriculumSubjectRepo curriculumSubjectRepo;
    private final TokenHemisRepo tokenHemisRepo;
    private final ExternalApiService externalApiService;

    @GetMapping("/update")
    public ResponseEntity<?> updateCurriculumSubjectAndSave() {
        System.out.println("\u25B6\uFE0F Starting curriculum subject update...");

        List<TokenHemis> all = tokenHemisRepo.findAll();
        if (all.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("\u274C Token not found");
        }

        String token = all.get(all.size() - 1).getName();
        int page = 1, savedCount = 0, totalPages = 1;
        Map<String, String> headers = Map.of("Authorization", "Bearer " + token);

        try {
            do {
                ResponseEntity<?> response = externalApiService.sendRequest(
                        "v1/data/curriculum-subject-list",
                        HttpMethod.GET,
                        headers,
                        Map.of("page", page),
                        null
                );

                Map<String, Object> body = (Map<String, Object>) response.getBody();
                Map<String, Object> data = (Map<String, Object>) body.get("data");
                List<Map<String, Object>> items = (List<Map<String, Object>>) data.get("items");
                Map<String, Object> pagination = (Map<String, Object>) data.get("pagination");
                totalPages = (Integer) pagination.get("pageCount");
                page++;

                for (Map<String, Object> item : items) {
                    Integer hemisId = (Integer) item.get("id");
                    if (curriculumSubjectRepo.findByHemisId(hemisId).isPresent()) continue;

                    // Subject
                    Map<String, Object> subjectMap = (Map<String, Object>) item.get("subject");
                    Integer subjectHemisId = (Integer) subjectMap.get("id");
                    Subject subject = subjectRepo.findByHemisId(subjectHemisId)
                            .orElseGet(() -> subjectRepo.save(
                                    Subject.builder()
                                            .hemisId(subjectHemisId)
                                            .name((String) subjectMap.get("name"))
                                            .code((String) subjectMap.get("code"))
                                            .build()
                            ));

                    // SubjectDetails
                    System.out.println(subject);
                    List<Map<String, Object>> detailsList = (List<Map<String, Object>>) item.get("subject_details");
                    if (detailsList == null)continue;
                    System.out.println(detailsList);
                    List<SubjectDetails> subjectDetails = new ArrayList<>();
                    for (Map<String, Object> detail : detailsList) {
                        Integer detailHemisId = (Integer) detail.get("id");
                        subjectDetails.add(subjectDetailsRepo.findByHemisId(detailHemisId)
                                .orElseGet(() -> subjectDetailsRepo.save(
                                        SubjectDetails.builder()
                                                .hemisId(detailHemisId)
                                                .trainingType((String) detail.get("training_type"))
                                                .academic_load((Integer) detail.get("academic_load"))
                                                .created(LocalDateTime.now())
                                                .build()
                                )));
                    }

                    // SubjectExamTypes
                    List<Map<String, Object>> examList = (List<Map<String, Object>>) item.get("subject_exam_types");
                    List<SubjectExamTypes> examTypes = new ArrayList<>();
                    for (Map<String, Object> exam : examList) {
                        Integer examHemisId = (Integer) exam.get("id");
                        examTypes.add(subjectExamTypesRepo.findByHemisId(examHemisId)
                                .orElseGet(() -> subjectExamTypesRepo.save(
                                        SubjectExamTypes.builder()
                                                .hemisId(examHemisId)
                                                .examType((String) exam.get("exam_type"))
                                                .max_ball((Integer) exam.get("max_ball"))
                                                .created(LocalDateTime.now())
                                                .build()
                                )));
                    }

                    // Departments
                    List<Map<String, Object>> deptList = (List<Map<String, Object>>) item.get("departments");
                    List<Department> departments = new ArrayList<>();
                    for (Map<String, Object> dept : deptList) {
                        Integer deptHemisId = (Integer) dept.get("id");
                        departments.add(departmentRepo.findByHemisId(deptHemisId)
                                .orElseGet(() -> departmentRepo.save(
                                        Department.builder()
                                                .hemisId(deptHemisId)
                                                .name((String) dept.get("name"))
                                                .code((String) dept.get("code"))
                                                .structureType(((Map<String, Object>) dept.get("structureType")).get("name").toString())
                                                .localityType(((Map<String, Object>) dept.get("localityType")).get("name").toString())
                                                .parent(dept.get("parent") != null ? (Integer) dept.get("parent") : null)
                                                .active((Boolean) dept.get("active"))
                                                .created(LocalDateTime.now())
                                                .build()
                                )));
                    }

                    // Curriculum
                    Map<String, Object> curriculumMap = (Map<String, Object>) item.get("curriculum");
                    Integer curriculumHemisId = (Integer) curriculumMap.get("id");
                    Curriculum curriculum = curriculumRepo.findByHemisId(curriculumHemisId)
                            .orElse(null);
                    if (curriculum == null) continue;

                    // Save CurriculumSubject
                    CurriculumSubject cs = CurriculumSubject.builder()
                            .hemisId(hemisId)
                            .subject(subject)
                            .subjectBlock((String) item.get("subject_block"))
                            .subjectType((String) item.get("subject_type"))
                            .subjectDetails(subjectDetails)
                            .subjectExamTypes(examTypes)
                            .departments(departments)
                            .curriculum(curriculum)
                            .totalAcload((Integer) item.get("total_acload"))
                            .resourceCount((Integer) item.get("resource_count"))
                            .in_group((String) item.get("in_group"))
                            .atSemester((Boolean) item.get("at_semester"))
                            .active((Boolean) item.get("active"))
                            .credit((Integer) item.get("credit"))
                            .created_at(Long.valueOf(item.get("created_at").toString()))
                            .updated_at(Long.valueOf(item.get("updated_at").toString()))
                            .isHaveLessons((Boolean) item.get("is_have_lessons"))
                            .created(LocalDateTime.now())
                            .build();

                    curriculumSubjectRepo.save(cs);
                    savedCount++;
                }

            } while (page <= totalPages);

            return ResponseEntity.ok("\u2705 Saved " + savedCount + " curriculum subjects.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("\u274C Error occurred: " + e.getMessage());
        }
    }
}
