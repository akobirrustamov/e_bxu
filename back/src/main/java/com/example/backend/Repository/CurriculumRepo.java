package com.example.backend.Repository;

import com.example.backend.Entity.Curriculum;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CurriculumRepo extends JpaRepository<Curriculum,Integer> {
}
