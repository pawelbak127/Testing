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
public class TestCase {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @NotBlank(message = "Test case name is required")
    private String name;
    
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
    
    @Embedded
    private Priority priority;
    
    @NotBlank(message = "Author is required")
    private String author;
    
    private LocalDateTime creationDate;
    
    @Embedded
    private Status status;
    
    @PrePersist
    protected void onCreate() {
        creationDate = LocalDateTime.now();
    }
    
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Priority {
        private String level;
        private String color;
    }
    
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Status {
        private String name;
        private String color;
    }
}
