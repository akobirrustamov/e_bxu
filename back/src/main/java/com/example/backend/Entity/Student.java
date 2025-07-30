package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "students")
@Entity
@Builder
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String first_name;
    private String second_name;
    private String image;
    private String group_name;
    private String level;
    private String passport_pin;
    @CreationTimestamp
    private LocalDateTime updated_at;


    public Student(String first_name, String second_name, String image, String group, String level, String passport_pin) {
        this.first_name = first_name;
        this.second_name = second_name;
        this.image = image;
        this.group_name = group;
        this.level = level;
        this.passport_pin = passport_pin;
    }

}
