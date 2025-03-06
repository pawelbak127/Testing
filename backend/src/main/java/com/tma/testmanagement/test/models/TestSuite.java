package com.tma.testmanagement.test.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "test_suites")
public class TestSuite {
    @Id
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "testproject_id", nullable = false)
    private Testproject testproject;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "details", length = Integer.MAX_VALUE)
    private String details;

}