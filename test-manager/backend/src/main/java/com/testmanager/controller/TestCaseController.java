package com.testmanager.controller;

import com.testmanager.model.TestCase;
import com.testmanager.repository.TestCaseRepository;
import com.testmanager.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/test-cases")
public class TestCaseController {
    
    @Autowired
    private TestCaseRepository testCaseRepository;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @GetMapping
    public ResponseEntity<List<TestCase>> getAllTestCases() {
        List<TestCase> testCases = testCaseRepository.findAll();
        return new ResponseEntity<>(testCases, HttpStatus.OK);
    }
    
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TestCase>> getTestCasesByProject(@PathVariable String projectId) {
        List<TestCase> testCases = testCaseRepository.findByProjectId(projectId);
        return new ResponseEntity<>(testCases, HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TestCase> getTestCaseById(@PathVariable String id) {
        Optional<TestCase> testCase = testCaseRepository.findById(id);
        return testCase.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping
    public ResponseEntity<TestCase> createTestCase(@Valid @RequestBody TestCase testCase) {
        // Ensure the project exists
        if (testCase.getProject() != null && testCase.getProject().getId() != null) {
            boolean projectExists = projectRepository.existsById(testCase.getProject().getId());
            if (!projectExists) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        }
        
        TestCase savedTestCase = testCaseRepository.save(testCase);
        return new ResponseEntity<>(savedTestCase, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TestCase> updateTestCase(@PathVariable String id, @Valid @RequestBody TestCase testCaseDetails) {
        return testCaseRepository.findById(id)
                .map(existingTestCase -> {
                    // Ensure the project exists if it's being updated
                    if (testCaseDetails.getProject() != null && testCaseDetails.getProject().getId() != null) {
                        boolean projectExists = projectRepository.existsById(testCaseDetails.getProject().getId());
                        if (!projectExists) {
                            return new ResponseEntity<TestCase>(HttpStatus.BAD_REQUEST);
                        }
                        existingTestCase.setProject(testCaseDetails.getProject());
                    }
                    
                    existingTestCase.setName(testCaseDetails.getName());
                    existingTestCase.setPriority(testCaseDetails.getPriority());
                    existingTestCase.setAuthor(testCaseDetails.getAuthor());
                    existingTestCase.setStatus(testCaseDetails.getStatus());
                    
                    TestCase updatedTestCase = testCaseRepository.save(existingTestCase);
                    return new ResponseEntity<>(updatedTestCase, HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTestCase(@PathVariable String id) {
        return testCaseRepository.findById(id)
                .map(testCase -> {
                    testCaseRepository.delete(testCase);
                    return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
