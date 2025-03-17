package com.testmanager.repository;

import com.testmanager.model.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TestCaseRepository extends JpaRepository<TestCase, String> {
    List<TestCase> findByProjectId(String projectId);
}
