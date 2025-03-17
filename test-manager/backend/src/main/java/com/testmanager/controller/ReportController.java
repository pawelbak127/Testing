package com.testmanager.controller;

import com.testmanager.model.Report;
import com.testmanager.repository.ReportRepository;
import com.testmanager.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/reports")
public class ReportController {
    
    @Autowired
    private ReportRepository reportRepository;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @GetMapping
    public ResponseEntity<List<Report>> getAllReports() {
        List<Report> reports = reportRepository.findAll();
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }
    
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Report>> getReportsByProject(@PathVariable String projectId) {
        List<Report> reports = reportRepository.findByProjectId(projectId);
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Report> getReportById(@PathVariable String id) {
        Optional<Report> report = reportRepository.findById(id);
        return report.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping
    public ResponseEntity<Report> createReport(@Valid @RequestBody Report report) {
        // Ensure the project exists
        if (report.getProject() != null && report.getProject().getId() != null) {
            boolean projectExists = projectRepository.existsById(report.getProject().getId());
            if (!projectExists) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        }
        
        Report savedReport = reportRepository.save(report);
        return new ResponseEntity<>(savedReport, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Report> updateReport(@PathVariable String id, @Valid @RequestBody Report reportDetails) {
        return reportRepository.findById(id)
                .map(existingReport -> {
                    // Ensure the project exists if it's being updated
                    if (reportDetails.getProject() != null && reportDetails.getProject().getId() != null) {
                        boolean projectExists = projectRepository.existsById(reportDetails.getProject().getId());
                        if (!projectExists) {
                            return new ResponseEntity<Report>(HttpStatus.BAD_REQUEST);
                        }
                        existingReport.setProject(reportDetails.getProject());
                    }
                    
                    existingReport.setTitle(reportDetails.getTitle());
                    existingReport.setIcon(reportDetails.getIcon());
                    existingReport.setColor(reportDetails.getColor());
                    
                    Report updatedReport = reportRepository.save(existingReport);
                    return new ResponseEntity<>(updatedReport, HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable String id) {
        return reportRepository.findById(id)
                .map(report -> {
                    reportRepository.delete(report);
                    return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
