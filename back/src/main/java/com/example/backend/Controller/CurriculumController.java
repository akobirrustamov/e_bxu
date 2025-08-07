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

    @GetMapping("/update")
    public HttpEntity<?> updateCurriculum() {
        System.out.println("▶️ Starting curriculum update...");

        List<TokenHemis> all = tokenHemisRepo.findAll();
        if (all.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Token not found");
        }

        String token = all.get(all.size() - 1).getName();
        int page = 1;
        int savedCount = 0;

        try {
            while (true) {
                ResponseEntity<?> response = externalApiService.sendRequest(
                        "v1/data/curriculum-subject-list",
                        HttpMethod.GET,
                        Map.of("Authorization", "Bearer " + token),
                        Map.of("page", page, "limit", 200, "l", "uz-UZ"),
                        null
                );

                if (!response.getStatusCode().is2xxSuccessful() || !(response.getBody() instanceof Map)) {
                    return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                            .body("❌ Error fetching page " + page + ": " + response.getBody());
                }

                Map<String, Object> body = (Map<String, Object>) response.getBody();
                if (!(Boolean.TRUE.equals(body.get("success")))) {
                    return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                            .body("❌ API returned failure: " + body.get("error"));
                }

                Map<String, Object> data = (Map<String, Object>) body.get("data");
                List<Map<String, Object>> items = (List<Map<String, Object>>) data.get("items");
                if (items == null || items.isEmpty()) break;

                for (Map<String, Object> item : items) {
                    Map<String, Object> subjectMap = (Map<String, Object>) item.get("subject");
                    if (subjectMap == null) continue;
                    Integer subjectHemisId = (Integer) subjectMap.get("id");
                    String subjectName = (String) subjectMap.get("name");
                    String subjectCode = (String) subjectMap.get("code");
                    Subject subject = subjectRepo.findByHemisId(subjectHemisId).orElseGet(() ->
                            subjectRepo.save(Subject.builder()
                                    .hemisId(subjectHemisId)
                                    .name(subjectName)
                                    .code(subjectCode)
                                    .created(LocalDateTime.now())
                                    .build()));

                    Map<String, Object> deptMap = (Map<String, Object>) item.get("department");
                    Department department = null;
                    if (deptMap != null) {
                        Integer deptHemisId = (Integer) deptMap.get("id");
                        String deptName = (String) deptMap.get("name");
                        String deptCode = (String) deptMap.get("code");
                        String structureType = deptMap.get("structureType") != null ?
                                (String) ((Map<String, Object>) deptMap.get("structureType")).get("name") : null;
                        String localityType = deptMap.get("localityType") != null ?
                                (String) ((Map<String, Object>) deptMap.get("localityType")).get("name") : null;
                        Integer parent = (Integer) deptMap.get("parent");
                        Boolean active = (Boolean) deptMap.get("active");
                        department = departmentRepo.findByHemisId(deptHemisId).orElseGet(() ->
                                departmentRepo.save(Department.builder()
                                        .hemisId(deptHemisId)
                                        .name(deptName)
                                        .code(deptCode)
                                        .structureType(structureType)
                                        .localityType(localityType)
                                        .parent(parent)
                                        .active(active)
                                        .created(LocalDateTime.now())
                                        .build()));
                    }

                    List<Map<String, Object>> subjectDetailsList = (List<Map<String, Object>>) item.get("subjectDetails");
                    List<SubjectDetails> savedDetails = new ArrayList<>();
                    for (Map<String, Object> detail : subjectDetailsList) {
                        Integer detailHemisId = (Integer) detail.get("id");
                        Integer academicLoad = (Integer) detail.get("academic_load");
                        String trainingType = (String) ((Map<String, Object>) detail.get("trainingType")).get("name");
                        SubjectDetails subjectDetails = subjectDetailsRepo.findByHemisId(detailHemisId).orElseGet(() ->
                                subjectDetailsRepo.save(SubjectDetails.builder()
                                        .hemisId(detailHemisId)
                                        .trainingType(trainingType)
                                        .academic_load(academicLoad)
                                        .created(LocalDateTime.now())
                                        .build()));
                        savedDetails.add(subjectDetails);
                    }

                    List<Map<String, Object>> subjectExamList = (List<Map<String, Object>>) item.get("subjectExamTypes");
                    List<SubjectExamTypes> savedExams = new ArrayList<>();
                    for (Map<String, Object> exam : subjectExamList) {
                        Integer examHemisId = (Integer) exam.get("id");
                        Integer maxBall = (Integer) exam.get("max_ball");
                        String examType = (String) ((Map<String, Object>) exam.get("examType")).get("name");
                        SubjectExamTypes examTypes = subjectExamTypesRepo.findByHemisId(examHemisId).orElseGet(() ->
                                subjectExamTypesRepo.save(SubjectExamTypes.builder()
                                        .hemisId(examHemisId)
                                        .max_ball(maxBall)
                                        .examType(examType)
                                        .created(LocalDateTime.now())
                                        .build()));
                        savedExams.add(examTypes);
                    }

                    Integer curriculumHemisId = (Integer) item.get("id");
                    String subjectType = (String) item.get("subject_type");
                    String subjectBlock = (String) item.get("subject_block");
                    Integer curriculumNum = (Integer) item.get("curriculum");
                    Integer totalAcload = (Integer) item.get("total_acload");
                    Integer resourceCount = (Integer) item.get("resource_count");
                    String inGroup = (String) item.get("in_group");
                    Boolean atSemester = (Boolean) item.get("at_semester");
                    Boolean activeCurriculum = (Boolean) item.get("active");
                    Integer credit = (Integer) item.get("credit");
                    Long createdAt = item.get("created_at") != null ? ((Number) item.get("created_at")).longValue() : null;
                    Long updatedAt = item.get("updated_at") != null ? ((Number) item.get("updated_at")).longValue() : null;

                    if (curriculumRepo.findByHemisId(curriculumHemisId).isEmpty()) {
                        Curriculum curriculum = Curriculum.builder()
                                .hemisId(curriculumHemisId)
                                .subject(subject)
                                .subjectType(subjectType)
                                .subjectBlock(subjectBlock)
                                .subjectDetails(savedDetails)
                                .subjectExamTypes(savedExams)
                                .departments(department != null ? List.of(department) : List.of())
                                ._curriculum(curriculumNum)
                                .totalAcload(totalAcload)
                                .resourceCount(resourceCount)
                                .in_group(inGroup)
                                .atSemester(atSemester)
                                .active(activeCurriculum)
                                .credit(credit)
                                .created_at(createdAt)
                                .updated_at(updatedAt)
                                .created(LocalDateTime.now())
                                .isHaveLessons(false)
                                .build();
                        try{
                            curriculumRepo.save(curriculum);

                        }catch (Exception e){
                            System.out.printf("Curriculum could not be saved\n");
                        }
                        savedCount++;
                    }
                }

                int pageCount = (Integer) ((Map<String, Object>) data.get("pagination")).get("pageCount");
                if (page >= pageCount) break;
                page++;
            }

            return ResponseEntity.ok("✅ Curriculum update completed. Total saved items: " + savedCount);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Exception: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Curriculum>> getAllCurriculum() {
        return ResponseEntity.ok(curriculumRepo.findAllActive());
    }


    @GetMapping
    public ResponseEntity<Map<String, Object>> getCurriculum(
            @RequestParam Long day_to, @RequestParam Long day_from,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "0") int page,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "20") int size,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String subjectName
    ) {
        try {
            org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);

            org.springframework.data.domain.Page<Curriculum> curriculumPage;



            if (subjectName != null && !subjectName.isBlank()) {
                curriculumPage = curriculumRepo.findBySubjectNameAndDateBetweenNative(subjectName, day_from, day_to, pageable);
            } else {
                curriculumPage = curriculumRepo.findByCreatedAtBetween(day_from, day_to, pageable);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("content", curriculumPage.getContent());
            response.put("currentPage", curriculumPage.getNumber());
            response.put("totalItems", curriculumPage.getTotalElements());
            response.put("totalPages", curriculumPage.getTotalPages());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "❌ Failed to fetch curriculum list: " + e.getMessage()));
        }
    }

}
