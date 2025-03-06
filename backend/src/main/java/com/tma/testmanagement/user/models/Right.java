package com.tma.testmanagement.user.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "rights")
public class Right {
    @Id
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "description", nullable = false, length = 100)
    private String description;

}