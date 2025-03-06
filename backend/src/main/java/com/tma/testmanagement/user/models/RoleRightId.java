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
public class RoleRightId implements Serializable {
    private static final long serialVersionUID = -7904094053022297426L;
    @Column(name = "role_id", nullable = false)
    private Long roleId;

    @Column(name = "right_id", nullable = false)
    private Long rightId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        RoleRightId entity = (RoleRightId) o;
        return Objects.equals(this.roleId, entity.roleId) &&
                Objects.equals(this.rightId, entity.rightId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(roleId, rightId);
    }

}