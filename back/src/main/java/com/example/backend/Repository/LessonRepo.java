package com.example.backend.Repository;

import com.example.backend.Entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface LessonRepo extends JpaRepository<Lesson,Integer> {
    @Query(value = "select * from lessons where hemis_id=:hemisId", nativeQuery = true)
    Optional<Lesson> findByHemisId(Integer hemisId);


    @Query(value = "select * from lessons where curriculumId=:curriculumId", nativeQuery = true)
    List<Lesson> findByIdCurriculm(Integer curriculumId);
}
