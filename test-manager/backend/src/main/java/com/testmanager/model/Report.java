package com.testmanager.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Report {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @NotBlank(message = "Report title is required")
    private String title;
    
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
    
    private LocalDateTime date;
    
    private String icon;
    
    private String color;
    
    @PrePersist
    protected void onCreate() {
        date = LocalDateTime.now();
    }
}
