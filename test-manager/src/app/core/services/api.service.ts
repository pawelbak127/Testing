import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TestCase } from '../models/test-case.model';
import { TestRun } from '../models/test-run.model';
import { Report } from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://api.example.com'; // Placeholder dla prawdziwego API
  
  // Mock data dla celów demonstracyjnych
  private testCasesMock: TestCase[] = [
    {
      id: 'TC-001',
      name: 'Logowanie użytkownika z poprawnymi danymi',
      project: { name: 'Portal klienta', color: 'green' },
      priority: { level: 'Wysoki', color: 'warn' },
      author: 'Jan Kowalski',
      creationDate: '10 mar 2025',
      status: { name: 'Aktywny', color: 'success' }
    },
    {
      id: 'TC-002',
      name: 'Rejestracja nowego użytkownika',
      project: { name: 'Portal klienta', color: 'green' },
      priority: { level: 'Średni', color: 'accent' },
      author: 'Anna Nowak',
      creationDate: '8 mar 2025',
      status: { name: 'Aktywny', color: 'success' }
    },
    {
      id: 'TC-003',
      name: 'Wyszukiwanie produktów według kategorii',
      project: { name: 'Aplikacja mobilna', color: 'purple' },
      priority: { level: 'Średni', color: 'accent' },
      author: 'Piotr Wiśniewski',
      creationDate: '7 mar 2025',
      status: { name: 'W przeglądzie', color: 'default' }
    },
    {
      id: 'TC-004',
      name: 'Realizacja płatności kartą kredytową',
      project: { name: 'Portal klienta', color: 'green' },
      priority: { level: 'Wysoki', color: 'warn' },
      author: 'Jan Kowalski',
      creationDate: '5 mar 2025',
      status: { name: 'Aktywny', color: 'success' }
    },
    {
      id: 'TC-005',
      name: 'Synchronizacja danych między aplikacjami',
      project: { name: 'Backend API', color: 'blue' },
      priority: { level: 'Niski', color: 'primary' },
      author: 'Tomasz Kowalczyk',
      creationDate: '2 mar 2025',
      status: { name: 'Nieaktywny', color: 'warn' }
    }
  ];
  
  constructor(private http: HttpClient) {}
  
  // Metody do obsługi TestCase
  getTestCases(): Observable<TestCase[]> {
    // W prawdziwej aplikacji: return this.http.get<TestCase[]>(`${this.apiUrl}/test-cases`);
    return of(this.testCasesMock).pipe(delay(300)); // Symulacja opóźnienia sieciowego
  }
  
  getTestCaseById(id: string): Observable<TestCase> {
    // W prawdziwej aplikacji: return this.http.get<TestCase>(`${this.apiUrl}/test-cases/${id}`);
    const testCase = this.testCasesMock.find(tc => tc.id === id);
    return of(testCase as TestCase).pipe(delay(300));
  }
  
  createTestCase(testCase: Partial<TestCase>): Observable<TestCase> {
    // W prawdziwej aplikacji: return this.http.post<TestCase>(`${this.apiUrl}/test-cases`, testCase);
    const newTestCase = {
      ...testCase,
      id: `TC-${Math.floor(Math.random() * 1000)}`,
      creationDate: new Date().toLocaleDateString()
    } as TestCase;
    this.testCasesMock.push(newTestCase);
    return of(newTestCase).pipe(delay(300));
  }
  
  updateTestCase(id: string, testCase: Partial<TestCase>): Observable<TestCase> {
    // W prawdziwej aplikacji: return this.http.put<TestCase>(`${this.apiUrl}/test-cases/${id}`, testCase);
    let index = this.testCasesMock.findIndex(tc => tc.id === id);
    if (index !== -1) {
      this.testCasesMock[index] = { ...this.testCasesMock[index], ...testCase };
      return of(this.testCasesMock[index]).pipe(delay(300));
    }
    return of({} as TestCase);
  }
  
  deleteTestCase(id: string): Observable<void> {
    // W prawdziwej aplikacji: return this.http.delete<void>(`${this.apiUrl}/test-cases/${id}`);
    this.testCasesMock = this.testCasesMock.filter(tc => tc.id !== id);
    return of(void 0).pipe(delay(300));
  }
}
