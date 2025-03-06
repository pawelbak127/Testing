package com.tma.testmanagement.test.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "tc_steps")
public class TcStep {
    @Id
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "actions", nullable = false, length = Integer.MAX_VALUE)
    private String actions;

    @Column(name = "expected_results", nullable = false, length = Integer.MAX_VALUE)
    private String expectedResults;

    @Column(name = "is_shared", nullable = false)
    private Boolean isShared = false;

}