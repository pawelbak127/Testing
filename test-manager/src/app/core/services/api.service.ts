import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TestCase } from '../models/test-case.model';
import { TestRun } from '../models/test-run.model';
import { Report } from '../models/report.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Używamy zmiennej środowiskowej dla URL API, co pozwala na łatwą zmianę w zależności od środowiska
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {
    console.log('API URL:', this.apiUrl);
  }
  
  // Metody projektu
  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/projects`).pipe(
      catchError(this.handleError<any[]>('getProjects', []))
    );
  }
  
  getProjectById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/projects/${id}`).pipe(
      catchError(this.handleError<any>('getProjectById'))
    );
  }
  
  createProject(project: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/projects`, project).pipe(
      catchError(this.handleError<any>('createProject'))
    );
  }
  
  updateProject(id: string, project: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/projects/${id}`, project).pipe(
      catchError(this.handleError<any>('updateProject'))
    );
  }
  
  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/projects/${id}`).pipe(
      catchError(this.handleError<void>('deleteProject'))
    );
  }
  
  // Metody TestCase
  getTestCases(): Observable<TestCase[]> {
    return this.http.get<any[]>(`${this.apiUrl}/testCases`).pipe(
      map(testCases => testCases.map(tc => this.mapTestCase(tc))),
      catchError(this.handleError<TestCase[]>('getTestCases', []))
    );
  }
  
  getTestCaseById(id: string): Observable<TestCase> {
    return this.http.get<any>(`${this.apiUrl}/testCases/${id}`).pipe(
      map(tc => this.mapTestCase(tc)),
      catchError(this.handleError<TestCase>('getTestCaseById'))
    );
  }
  
  createTestCase(testCase: Partial<TestCase>): Observable<TestCase> {
    return this.http.post<any>(`${this.apiUrl}/testCases`, testCase).pipe(
      map(tc => this.mapTestCase(tc)),
      catchError(this.handleError<TestCase>('createTestCase'))
    );
  }
  
  updateTestCase(id: string, testCase: Partial<TestCase>): Observable<TestCase> {
    return this.http.put<any>(`${this.apiUrl}/testCases/${id}`, testCase).pipe(
      map(tc => this.mapTestCase(tc)),
      catchError(this.handleError<TestCase>('updateTestCase'))
    );
  }
  
  deleteTestCase(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/testCases/${id}`).pipe(
      catchError(this.handleError<void>('deleteTestCase'))
    );
  }
  
  // Metody TestRun
  getTestRuns(): Observable<TestRun[]> {
    return this.http.get<any[]>(`${this.apiUrl}/testRuns`).pipe(
      map(testRuns => testRuns.map(tr => this.mapTestRun(tr))),
      catchError(this.handleError<TestRun[]>('getTestRuns', []))
    );
  }
  
  getTestRunById(id: string): Observable<TestRun> {
    return this.http.get<any>(`${this.apiUrl}/testRuns/${id}`).pipe(
      map(tr => this.mapTestRun(tr)),
      catchError(this.handleError<TestRun>('getTestRunById'))
    );
  }
  
  createTestRun(testRun: Partial<TestRun>): Observable<TestRun> {
    return this.http.post<any>(`${this.apiUrl}/testRuns`, testRun).pipe(
      map(tr => this.mapTestRun(tr)),
      catchError(this.handleError<TestRun>('createTestRun'))
    );
  }
  
  updateTestRun(id: string, testRun: Partial<TestRun>): Observable<TestRun> {
    return this.http.put<any>(`${this.apiUrl}/testRuns/${id}`, testRun).pipe(
      map(tr => this.mapTestRun(tr)),
      catchError(this.handleError<TestRun>('updateTestRun'))
    );
  }
  
  deleteTestRun(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/testRuns/${id}`).pipe(
      catchError(this.handleError<void>('deleteTestRun'))
    );
  }
  
  // Metody Report
  getReports(): Observable<Report[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reports`).pipe(
      map(reports => reports.map(r => this.mapReport(r))),
      catchError(this.handleError<Report[]>('getReports', []))
    );
  }
  
  getReportById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reports/${id}`).pipe(
      catchError(this.handleError<any>('getReportById'))
    );
  }
  
  createReport(report: Partial<Report>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reports`, report).pipe(
      catchError(this.handleError<any>('createReport'))
    );
  }
  
  updateReport(id: string, report: Partial<Report>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/reports/${id}`, report).pipe(
      catchError(this.handleError<any>('updateReport'))
    );
  }
  
  deleteReport(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reports/${id}`).pipe(
      catchError(this.handleError<void>('deleteReport'))
    );
  }

  // Pomocnicze metody mapowania danych
  private mapTestCase(tc: any): TestCase {
    return {
      id: tc.id || '',
      name: tc.name || '',
      project: { 
        name: tc.project?.name || 'Nieznany projekt', 
        color: tc.project?.color || 'blue' 
      },
      priority: { 
        level: tc.priority?.level || 'Średni', 
        color: tc.priority?.color || 'accent' 
      },
      author: tc.author || 'Nieznany',
      creationDate: tc.creationDate ? new Date(tc.creationDate).toLocaleDateString() : '',
      status: { 
        name: tc.status?.name || 'Aktywny', 
        color: tc.status?.color || 'success' 
      }
    };
  }

  private mapTestRun(tr: any): TestRun {
    return {
      id: tr.id || '',
      name: tr.name || '',
      project: tr.project?.name || 'Nieznany projekt',
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
    };
  }

  private mapReport(r: any): Report {
    return {
      title: r.title || '',
      project: r.project?.name || 'Wszystkie projekty',
      date: r.date ? new Date(r.date).toLocaleDateString() : '',
      icon: r.icon || 'assessment',
      color: r.color || 'primary'
    };
  }

  // Obsługa błędów HTTP
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      
      // Pozwól aplikacji działać dalej, zwracając pusty wynik
      return of(result as T);
    };
  }
}
