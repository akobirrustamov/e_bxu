package com.example.backend.Repository;

import com.example.backend.Entity.TeacherCurriculum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface TeacherCurriculumRepo extends JpaRepository<TeacherCurriculum,UUID> {
    @Query(value = "SELECT * FROM teacher_curriculms", nativeQuery = true)
    List<TeacherCurriculum> findAllNative();

    @Query(value = "SELECT * FROM teacher_curriculms WHERE teacher_id = :teacherId", nativeQuery = true)
    List<TeacherCurriculum> findByTeacherIdNative(@Param("teacherId") UUID teacherId);

    @Query(value = "SELECT * FROM teacher_curriculms WHERE curriculum_id = :curriculumId", nativeQuery = true)
    List<TeacherCurriculum> findByCurriculumIdNative(@Param("curriculumId") UUID curriculumId);

}
