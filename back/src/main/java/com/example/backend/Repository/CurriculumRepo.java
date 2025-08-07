package com.example.backend.Repository;

import com.example.backend.Entity.Curriculum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.Optional;

public interface CurriculumRepo extends JpaRepository<Curriculum,Integer> {

    @Query(value = "select * from curriculum where hemis_id=:curriculumHemisId", nativeQuery = true)
    Optional<Curriculum> findByHemisId(Integer curriculumHemisId);
    @Query(
            value = """
            SELECT c.* FROM curriculum c
            JOIN subject s ON c.subject_id = s.id
            WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :subjectName, '%'))
            """,
            countQuery = """
            SELECT COUNT(*) FROM curriculum c
            JOIN subject s ON c.subject_id = s.id
            WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :subjectName, '%'))
            """,
            nativeQuery = true
    )
    Page<Curriculum> findBySubjectNameNative(@Param("subjectName") String subjectName, Pageable pageable);

}
