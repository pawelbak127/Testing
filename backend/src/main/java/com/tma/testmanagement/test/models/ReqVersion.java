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

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "req_versions")
public class ReqVersion {
    @Id
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "req_id", nullable = false)
    private Long reqId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "req_spec_id", nullable = false)
    private ReqSpecVersion reqSpec;

    @Column(name = "version", nullable = false)
    private Integer version;

    @Column(name = "scope", length = Integer.MAX_VALUE)
    private String scope;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = false;

    @Column(name = "is_open", nullable = false)
    private Boolean isOpen = false;

    @Column(name = "author_id", nullable = false)
    private Long authorId;

    @Column(name = "creation_ts", nullable = false)
    private Instant creationTs;

    @Column(name = "modifier_id", nullable = false)
    private Long modifierId;

    @Column(name = "modification_ts")
    private Instant modificationTs;

}