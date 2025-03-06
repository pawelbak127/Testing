package com.tma.testmanagement.test.models;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Embeddable
public class ExecutionBugId implements Serializable {
    private static final long serialVersionUID = 2147082800622932977L;
    @Column(name = "test_run_id", nullable = false)
    private Long testRunId;

    @Column(name = "bug_id", nullable = false, length = 64)
    private String bugId;

    @Column(name = "tcstep_id", nullable = false)
    private Long tcstepId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        ExecutionBugId entity = (ExecutionBugId) o;
        return Objects.equals(this.bugId, entity.bugId) &&
                Objects.equals(this.testRunId, entity.testRunId) &&
                Objects.equals(this.tcstepId, entity.tcstepId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(bugId, testRunId, tcstepId);
    }

}