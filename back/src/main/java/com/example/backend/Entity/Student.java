package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true, nullable = false)
    private Integer hemisId;

    private Integer metaId;

    private String fullName;
    private String shortName;
    private String firstName;
    private String secondName;
    private String thirdName;

    private String gender;
    private Long birthDate;

    private String studentIdNumber;
    private String image;

    private Double avgGpa;
    private Double avgGrade;
    private Integer totalCredit;

    private String country;
    private String province;
    private String currentProvince;
    private String district;
    private String currentDistrict;
    private String terrain;
    private String currentTerrain;

    private String citizenship;
    private String studentStatus;

    private Integer curriculumId;

    private String educationForm;
    private String educationType;
    private String paymentForm;
    private String studentType;
    private String socialCategory;
    private String accommodation;

    private String departmentName;
    private String specialtyName;

    private String groupName;
    private String groupLang;

    private String level;
    private String levelName;

    private String semester;
    private String semesterName;

    private String educationYear;
    private Integer yearOfEnter;

    private Integer roommateCount;
    private Boolean isGraduate;

    private Integer totalAcload;
    private String other;

    private String validateUrl;
    private String email;
    private String hash;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ManyToOne
    private Groups group;

    @ManyToOne
    private Attachment imageFile;
}
