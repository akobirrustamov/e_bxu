package com.example.backend.Repository;

import com.example.backend.Entity.Curriculum;
import com.example.backend.Entity.CurriculumSubject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CurriculumSubjectRepo extends JpaRepository<CurriculumSubject, UUID> {


    @Query(value = "select * from curriculum_subject where hemis_id=:hemisId", nativeQuery = true)
    Optional<CurriculumSubject> findByHemisId(Integer hemisId);
}
