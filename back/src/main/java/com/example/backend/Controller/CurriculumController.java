package com.example.backend.Controller;

import com.example.backend.Repository.CurriculumRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/curriculum")
@RequiredArgsConstructor
public class CurriculumController {

    private final CurriculumRepo curriculumRepo;

    private final com.example.backend.Service.ExternalApiService externalApiService;

    @GetMapping
    public HttpEntity<?> getCurriculum(){
        return new ResponseEntity<>(curriculumRepo.findAll(), HttpStatus.OK);
    }

//
//    @GetMapping("/update")
//    public HttpEntity<?> updateCurriculum(){
//
//
//
//
//    }




}
