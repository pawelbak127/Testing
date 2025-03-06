package com.tma.testmanagement.test.models;

import com.tma.testmanagement.user.models.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "test_runs")
public class TestRun {
    @Id
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "testplan_id", nullable = false)
    private Testplan testplan;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tester_id", nullable = false)
    private User tester;

    @Column(name = "execution_ts", nullable = false)
    private Instant executionTs;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "status_id", nullable = false)
    private TrStatus status;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tcversion_id", nullable = false)
    private TcVersion tcversion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "configuration_id", nullable = false)
    private Configuration configuration;

    @Column(name = "execution_duration", precision = 6, scale = 2)
    private BigDecimal executionDuration;

    @Column(name = "notes", length = Integer.MAX_VALUE)
    private String notes;

}