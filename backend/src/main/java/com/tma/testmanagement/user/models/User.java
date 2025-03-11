package com.tma.testmanagement.user.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {
    @Id
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "login", nullable = false, length = 30)
    private String login;

    @Column(name = "password", nullable = false, length = 30)
    private String password;

    @Column(name = "email", nullable = false, length = 50)
    private String email;

    @Column(name = "first", nullable = false, length = 50)
    private String first;

    @Column(name = "last", nullable = false, length = 50)
    private String last;

    @Column(name = "locale", nullable = false, length = 10)
    private String locale;

    @Column(name = "active", nullable = false)
    private Boolean active = false;

    @Column(name = "creation_ts", nullable = false)
    private Instant creationTs;

    @Column(name = "expiration_date", nullable = false)
    private LocalDate expirationDate;

}