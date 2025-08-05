package com.example.backend.Repository;

import com.example.backend.Entity.SubjectDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubjectDetailsRepo extends JpaRepository<SubjectDetails, Integer> {
}
