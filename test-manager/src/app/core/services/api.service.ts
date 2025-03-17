import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TestCase } from '../models/test-case.model';
import { TestRun } from '../models/test-run.model';
import { Report } from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api'; // URL to our backend API
  
  constructor(private http: HttpClient) {}
  
  // Project methods
  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/projects`);
  }
  
  getProjectById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/projects/${id}`);
  }
  
  createProject(project: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/projects`, project);
  }
  
  updateProject(id: string, project: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/projects/${id}`, project);
  }
  
  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/projects/${id}`);
  }
  
  // TestCase methods
  getTestCases(): Observable<TestCase[]> {
    return this.http.get<any[]>(`${this.apiUrl}/test-cases`).pipe(
      map(testCases => testCases.map(tc => ({
        id: tc.id,
        name: tc.name,
        project: { 
          name: tc.project.name, 
          color: tc.project.color 
        },
        priority: { 
          level: tc.priority.level, 
          color: tc.priority.color 
        },
        author: tc.author,
        creationDate: new Date(tc.creationDate).toLocaleDateString(),
        status: { 
          name: tc.status.name, 
          color: tc.status.color 
        }
      })))
    );
  }
  
  getTestCaseById(id: string): Observable<TestCase> {
    return this.http.get<any>(`${this.apiUrl}/test-cases/${id}`).pipe(
      map(tc => ({
        id: tc.id,
        name: tc.name,
        project: { 
          name: tc.project.name, 
          color: tc.project.color 
        },
        priority: { 
          level: tc.priority.level, 
          color: tc.priority.color 
        },
        author: tc.author,
        creationDate: new Date(tc.creationDate).toLocaleDateString(),
        status: { 
          name: tc.status.name, 
          color: tc.status.color 
        }
      }))
    );
  }
  
  createTestCase(testCase: Partial<TestCase>): Observable<TestCase> {
    return this.http.post<any>(`${this.apiUrl}/test-cases`, testCase).pipe(
      map(tc => ({
        id: tc.id,
        name: tc.name,
        project: { 
          name: tc.project.name, 
          color: tc.project.color 
        },
        priority: { 
          level: tc.priority.level, 
          color: tc.priority.color 
        },
        author: tc.author,
        creationDate: new Date(tc.creationDate).toLocaleDateString(),
        status: { 
          name: tc.status.name, 
          color: tc.status.color 
        }
      }))
    );
  }
  
  updateTestCase(id: string, testCase: Partial<TestCase>): Observable<TestCase> {
    return this.http.put<any>(`${this.apiUrl}/test-cases/${id}`, testCase).pipe(
      map(tc => ({
        id: tc.id,
        name: tc.name,
        project: { 
          name: tc.project.name, 
          color: tc.project.color 
        },
        priority: { 
          level: tc.priority.level, 
          color: tc.priority.color 
        },
        author: tc.author,
        creationDate: new Date(tc.creationDate).toLocaleDateString(),
        status: { 
          name: tc.status.name, 
          color: tc.status.color 
        }
      }))
    );
  }
  
  deleteTestCase(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/test-cases/${id}`);
  }
  
  // TestRun methods
  getTestRuns(): Observable<TestRun[]> {
    return this.http.get<any[]>(`${this.apiUrl}/test-runs`).pipe(
      map(testRuns => testRuns.map(tr => ({
        id: tr.id,
        name: tr.name,
        project: tr.project.name,
        progress: tr.progress ? {
          current: tr.progress.current,
          total: tr.progress.total,
          percentage: tr.progress.percentage
        } : undefined,
        results: tr.results ? {
          success: tr.results.success,
          errors: tr.results.errors
        } : undefined,
        date: tr.date ? new Date(tr.date).toLocaleDateString() : undefined
      })))
    );
  }
  
  getTestRunById(id: string): Observable<TestRun> {
    return this.http.get<any>(`${this.apiUrl}/test-runs/${id}`).pipe(
      map(tr => ({
        id: tr.id,
        name: tr.name,
        project: tr.project.name,
        progress: tr.progress ? {
          current: tr.progress.current,
          total: tr.progress.total,
          percentage: tr.progress.percentage
        } : undefined,
        results: tr.results ? {
          success: tr.results.success,
          errors: tr.results.errors
        } : undefined,
        date: tr.date ? new Date(tr.date).toLocaleDateString() : undefined
      }))
    );
  }
  
  createTestRun(testRun: Partial<TestRun>): Observable<TestRun> {
    return this.http.post<any>(`${this.apiUrl}/test-runs`, testRun);
  }
  
  updateTestRun(id: string, testRun: Partial<TestRun>): Observable<TestRun> {
    return this.http.put<any>(`${this.apiUrl}/test-runs/${id}`, testRun);
  }
  
  deleteTestRun(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/test-runs/${id}`);
  }
  
  // Report methods
  getReports(): Observable<Report[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reports`).pipe(
      map(reports => reports.map(r => ({
        title: r.title,
        project: r.project.name,
        date: new Date(r.date).toLocaleDateString(),
        icon: r.icon,
        color: r.color
      })))
    );
  }
  
  getReportById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reports/${id}`);
  }
  
  createReport(report: Partial<Report>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reports`, report);
  }
  
  updateReport(id: string, report: Partial<Report>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/reports/${id}`, report);
  }
  
  deleteReport(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reports/${id}`);
  }
}
