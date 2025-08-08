package com.example.backend.Repository;

import com.example.backend.Entity.TeacherCurriculumSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface TeacherCurriculumRepo extends JpaRepository<TeacherCurriculumSubject,UUID> {

}
