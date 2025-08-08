package com.example.backend.Controller;

import com.example.backend.DTO.StudentLoginDTO;
import com.example.backend.Entity.Student;
import com.example.backend.Repository.StudentRepo;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/student")
@RequiredArgsConstructor
public class StudentController {
    private final StudentRepo studentRepo;
    private static final Logger logger = LoggerFactory.getLogger(StudentController.class);

    @PostMapping("/login")
    public HttpEntity<?> login(@RequestBody StudentLoginDTO studentLoginDTO) {
        System.out.println(studentLoginDTO);
        try {
            RestTemplate restTemplate = new RestTemplate(); // No custom factory needed
            String loginUrl = "https://student.buxpxti.uz/rest/v1/auth/login";

            // Prepare login payload
            Map<String, String> loginPayload = Map.of(
                    "login", studentLoginDTO.getLogin(),
                    "password", studentLoginDTO.getPassword()
            );

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));

            // Create request entity
            HttpEntity<Map<String, String>> request = new HttpEntity<>(loginPayload, headers);

            // Send POST request
            ResponseEntity<Map> response = restTemplate.exchange(
                    loginUrl,
                    HttpMethod.POST,
                    request,
                    Map.class
            );

            // Handle response
            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> responseBody = response.getBody();
                if (responseBody != null && responseBody.containsKey("data")) {
                    Map<String, Object> data = (Map<String, Object>) responseBody.get("data");
                    String token = (String) data.get("token");
                    return ResponseEntity.ok(token);
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Login succeeded but token missing.");
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid login credentials");
            }

        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }


    // Get a list of students by group name
    @GetMapping("/group/{groupName}")
    public HttpEntity<?> getStudentsByGroup(@PathVariable String groupName) {
        List<Student> studentsInGroup = studentRepo.findAllByGroup(groupName);
        return ResponseEntity.ok(studentsInGroup);
    }
    // Get a student by passport pin
    @GetMapping("/{passportPin}")
    public HttpEntity<?> getStudentByPassportPin(@PathVariable String passportPin) {
        Student student = studentRepo.findByPassport_pin(passportPin)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return ResponseEntity.ok(student);
    }


    @GetMapping("/account/all/{token}")
    public HttpEntity<?> getStudentAllDataByToken(@PathVariable String token) {
        try {
            System.out.println(token);
            RestTemplate restTemplate = new RestTemplate();
            String externalApiUrl = "https://student.buxpxti.uz/rest/v1/account/me";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + token);
            HttpEntity<String> request = new HttpEntity<>(headers);
            ResponseEntity<Map> response = restTemplate.exchange(
                    externalApiUrl,
                    HttpMethod.GET,
                    request,
                    Map.class
            );

            // Check if the response is OK and process the data
            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> responseBody = response.getBody();
                Map<String, Object> data = (Map<String, Object>) responseBody.get("data");
                Map<String, Object> group = (Map<String, Object>) data.get("group");
                Map<String, Object> level = (Map<String, Object>) data.get("level");



                return ResponseEntity.ok(data); // Save or update the student
            } else {
                return new ResponseEntity<>("Failed to fetch student data", HttpStatus.BAD_REQUEST);
            }

        } catch (Exception e) {
            logger.error("Error fetching student data by token: ", e);
            return new ResponseEntity<>("Error occurred while fetching student data", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/debt/{token}")
    public HttpEntity<?> getDebtOfStudent(@PathVariable String token) {
        try {
            System.out.println(token);
            RestTemplate restTemplate = new RestTemplate();
            String externalApiUrl = "https://student.buxpxti.uz/rest/v1/education/subject-list";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + token);
            HttpEntity<String> request = new HttpEntity<>(headers);
            ResponseEntity<Map> response = restTemplate.exchange(
                    externalApiUrl,
                    HttpMethod.GET,
                    request,
                    Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> responseBody = response.getBody();
                Object data = responseBody.get("data");

                if (data instanceof List) {
                    List<?> dataList = (List<?>) data;

                    // Filter and transform the list based on the required criteria
                    List<Map<String, Object>> filteredResults = dataList.stream()
                            .filter(item -> {
                                Map<String, Object> overallScore = (Map<String, Object>) ((Map<String, Object>) item).get("overallScore");
                                return overallScore != null &&
                                        (int) overallScore.get("grade") < 0.6 * (int) overallScore.get("max_ball");
                            })

                            .map(item -> {
                                Map<String, Object> curriculumSubject = (Map<String, Object>) ((Map<String, Object>) item).get("curriculumSubject");
                                Map<String, Object> subject = (Map<String, Object>) curriculumSubject.get("subject");
                                Map<String, Object> overallScore = (Map<String, Object>) ((Map<String, Object>) item).get("overallScore");

                                Map<String, Object> result = Map.of(
                                        "_semester", ((Map<String, Object>) item).get("_semester"),
                                        "credit", curriculumSubject.get("credit"),
                                        "total_acload", curriculumSubject.get("total_acload"),
                                        "subjectName", subject.get("name"),
                                        "overallScore", Map.of(
                                                "grade", overallScore.get("grade"),
                                                "max_ball", overallScore.get("max_ball"),
                                                "percent", overallScore.get("percent"),
                                                "label", overallScore.get("label")
                                        )
                                );
                                return result;
                            })
                            .toList();

                    return ResponseEntity.ok(filteredResults);
                } else {
                    return new ResponseEntity<>("Unexpected data format", HttpStatus.BAD_REQUEST);
                }
            } else {
                return new ResponseEntity<>("Failed to fetch student data", HttpStatus.BAD_REQUEST);
            }

        } catch (Exception e) {
            logger.error("Error fetching student data by token: ", e);
            return new ResponseEntity<>("Error occurred while fetching student data", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



}
