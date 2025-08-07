package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "teacher_curriculms")
@Entity
@Builder
public class TeacherCurriculum {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;



    @ManyToOne
    private  User teacher;
    @ManyToOne
    private  Curriculum curriculum;
    private LocalDateTime created;


}
