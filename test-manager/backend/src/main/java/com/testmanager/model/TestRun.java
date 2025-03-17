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
public class TestRun {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @NotBlank(message = "Test run name is required")
    private String name;
    
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
    
    @Embedded
    private Progress progress;
    
    @Embedded
    private Results results;
    
    private LocalDateTime date;
    
    @PrePersist
    protected void onCreate() {
        date = LocalDateTime.now();
    }
    
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Progress {
        private int current;
        private int total;
        private int percentage;
    }
    
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Results {
        private int success;
        private int errors;
    }
}
