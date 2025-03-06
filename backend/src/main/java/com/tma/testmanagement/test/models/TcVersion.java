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

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "tc_versions")
public class TcVersion {
    @Id
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "tc_id", nullable = false)
    private Long tcId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "testsuite_id", nullable = false)
    private TestSuite testsuite;

    @Column(name = "version", nullable = false)
    private Integer version;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "status_id", nullable = false)
    private TcStatus status;

    @Column(name = "summary", length = Integer.MAX_VALUE)
    private String summary;

    @Column(name = "preconditions", length = Integer.MAX_VALUE)
    private String preconditions;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "priority_id", nullable = false)
    private TcPriority priority;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Column(name = "creation_ts", nullable = false)
    private Instant creationTs;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "updater_id", nullable = false)
    private User updater;

    @Column(name = "modification_ts", nullable = false)
    private Instant modificationTs;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = false;

    @Column(name = "is_open", nullable = false)
    private Boolean isOpen = false;

    @Column(name = "execution_type", nullable = false)
    private Integer executionType;

}