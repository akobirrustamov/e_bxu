package com.example.backend.Repository;

import com.example.backend.Entity.SubjectExamTypes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Map;
import java.util.Optional;

public interface SubjectExamTypesRepo extends JpaRepository<SubjectExamTypes,Integer> {

    @Query(value = "select * from subject_exam_types where hemis_id=:examHemisId", nativeQuery = true)
   Optional<SubjectExamTypes> findByHemisId(Integer examHemisId);
}
