package com.tma.testmanagement.user.repositories;

import com.tma.testmanagement.user.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByLogin(String login);
    
    Optional<User> findByEmail(String email);
}
