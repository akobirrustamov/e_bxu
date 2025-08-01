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
@Table(name = "lessons")
@Entity
@Builder
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private Integer hemisId;
    private String name;
    private Integer topic_load;
    private Integer position;
    @ManyToOne
    private Subject subject;
    private Boolean active;
    private Integer department;
    private Integer curriculum;
    private Integer semester;
    private Integer trainingType;
    private Long createdAt;
    private Long updatedAt;
    private LocalDateTime time;
    private Boolean isMy;


}
