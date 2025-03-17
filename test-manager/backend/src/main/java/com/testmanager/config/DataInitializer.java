package com.testmanager.config;

import com.testmanager.model.*;
import com.testmanager.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.time.LocalDateTime;

@Configuration
public class DataInitializer {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private TestCaseRepository testCaseRepository;
    
    @Autowired
    private TestRunRepository testRunRepository;
    
    @Autowired
    private ReportRepository reportRepository;
    
    @Bean
    public CommandLineRunner initData() {
        return args -> {
            // Create projects
            Project portalProject = new Project(null, "Portal klienta", "green", "Aplikacja internetowa dla klientów");
            Project mobileProject = new Project(null, "Aplikacja mobilna", "purple", "Aplikacja na iOS i Android");
            Project backendProject = new Project(null, "Backend API", "blue", "REST API dla wszystkich aplikacji");
            
            projectRepository.save(portalProject);
            projectRepository.save(mobileProject);
            projectRepository.save(backendProject);
            
            // Create test cases
            TestCase tc1 = new TestCase();
            tc1.setName("Logowanie użytkownika z poprawnymi danymi");
            tc1.setProject(portalProject);
            tc1.setPriority(new TestCase.Priority("Wysoki", "warn"));
            tc1.setAuthor("Jan Kowalski");
            tc1.setStatus(new TestCase.Status("Aktywny", "success"));
            
            TestCase tc2 = new TestCase();
            tc2.setName("Rejestracja nowego użytkownika");
            tc2.setProject(portalProject);
            tc2.setPriority(new TestCase.Priority("Średni", "accent"));
            tc2.setAuthor("Anna Nowak");
            tc2.setStatus(new TestCase.Status("Aktywny", "success"));
            
            TestCase tc3 = new TestCase();
            tc3.setName("Wyszukiwanie produktów według kategorii");
            tc3.setProject(mobileProject);
            tc3.setPriority(new TestCase.Priority("Średni", "accent"));
            tc3.setAuthor("Piotr Wiśniewski");
            tc3.setStatus(new TestCase.Status("W przeglądzie", "default"));
            
            testCaseRepository.save(tc1);
            testCaseRepository.save(tc2);
            testCaseRepository.save(tc3);
            
            // Create test runs
            TestRun tr1 = new TestRun();
            tr1.setName("Sprint 1 - Testy logowania");
            tr1.setProject(portalProject);
            tr1.setProgress(new TestRun.Progress(8, 10, 80));
            tr1.setResults(new TestRun.Results(7, 1));
            
            TestRun tr2 = new TestRun();
            tr2.setName("Sprint 2 - Testy rejestracji");
            tr2.setProject(portalProject);
            tr2.setProgress(new TestRun.Progress(5, 5, 100));
            tr2.setResults(new TestRun.Results(5, 0));
            
            testRunRepository.save(tr1);
            testRunRepository.save(tr2);
            
            // Create reports
            Report r1 = new Report();
            r1.setTitle("Raport z testów logowania");
            r1.setProject(portalProject);
            r1.setIcon("assessment");
            r1.setColor("green");
            
            Report r2 = new Report();
            r2.setTitle("Raport z testów wydajnościowych");
            r2.setProject(backendProject);
            r2.setIcon("speed");
            r2.setColor("blue");
            
            reportRepository.save(r1);
            reportRepository.save(r2);
        };
    }
}
