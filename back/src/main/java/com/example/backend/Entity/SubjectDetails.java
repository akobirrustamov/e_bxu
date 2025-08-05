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
@Table(name = "subject_details")
@Entity
@Builder
public class SubjectDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private Integer hemisId;
    private String trainingType;
    private Integer academic_load;
    private LocalDateTime created;


}
