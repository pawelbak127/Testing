package com.testmanager.controller;

import com.testmanager.model.TestRun;
import com.testmanager.repository.TestRunRepository;
import com.testmanager.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/test-runs")
public class TestRunController {
    
    @Autowired
    private TestRunRepository testRunRepository;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @GetMapping
    public ResponseEntity<List<TestRun>> getAllTestRuns() {
        List<TestRun> testRuns = testRunRepository.findAll();
        return new ResponseEntity<>(testRuns, HttpStatus.OK);
    }
    
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TestRun>> getTestRunsByProject(@PathVariable String projectId) {
        List<TestRun> testRuns = testRunRepository.findByProjectId(projectId);
        return new ResponseEntity<>(testRuns, HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TestRun> getTestRunById(@PathVariable String id) {
        Optional<TestRun> testRun = testRunRepository.findById(id);
        return testRun.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping
    public ResponseEntity<TestRun> createTestRun(@Valid @RequestBody TestRun testRun) {
        // Ensure the project exists
        if (testRun.getProject() != null && testRun.getProject().getId() != null) {
            boolean projectExists = projectRepository.existsById(testRun.getProject().getId());
            if (!projectExists) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        }
        
        TestRun savedTestRun = testRunRepository.save(testRun);
        return new ResponseEntity<>(savedTestRun, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TestRun> updateTestRun(@PathVariable String id, @Valid @RequestBody TestRun testRunDetails) {
        return testRunRepository.findById(id)
                .map(existingTestRun -> {
                    // Ensure the project exists if it's being updated
                    if (testRunDetails.getProject() != null && testRunDetails.getProject().getId() != null) {
                        boolean projectExists = projectRepository.existsById(testRunDetails.getProject().getId());
                        if (!projectExists) {
                            return new ResponseEntity<TestRun>(HttpStatus.BAD_REQUEST);
                        }
                        existingTestRun.setProject(testRunDetails.getProject());
                    }
                    
                    existingTestRun.setName(testRunDetails.getName());
                    existingTestRun.setProgress(testRunDetails.getProgress());
                    existingTestRun.setResults(testRunDetails.getResults());
                    
                    TestRun updatedTestRun = testRunRepository.save(existingTestRun);
                    return new ResponseEntity<>(updatedTestRun, HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTestRun(@PathVariable String id) {
        return testRunRepository.findById(id)
                .map(testRun -> {
                    testRunRepository.delete(testRun);
                    return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
