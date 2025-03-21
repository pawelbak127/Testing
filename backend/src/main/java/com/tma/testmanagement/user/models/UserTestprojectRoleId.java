package com.tma.testmanagement.user.models;

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
public class UserTestprojectRoleId implements Serializable {
    private static final long serialVersionUID = -7252071431442766913L;
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "testproject_id", nullable = false)
    private Long testprojectId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        UserTestprojectRoleId entity = (UserTestprojectRoleId) o;
        return Objects.equals(this.testprojectId, entity.testprojectId) &&
                Objects.equals(this.userId, entity.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(testprojectId, userId);
    }

}