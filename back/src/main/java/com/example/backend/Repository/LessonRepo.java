package com.example.backend.Repository;

import com.example.backend.Entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonRepo extends JpaRepository<Lesson,Integer> {
}
