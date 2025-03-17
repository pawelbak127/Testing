import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { tap, catchError } from 'rxjs/operators';

export interface Project {
  id: string;
  name: string;
  color: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: Project[] = [];
  
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  private selectedProjectSubject = new BehaviorSubject<Project | null>(null);
  
  constructor(private apiService: ApiService) {
    // Załaduj projekty z API przy inicjalizacji serwisu
    this.loadProjects();
  }
  
  private loadProjects(): void {
    this.apiService.getProjects().pipe(
      catchError(error => {
        console.error('Błąd podczas ładowania projektów:', error);
        // Używamy danych przykładowych, jeśli API zwróci błąd
        this.setupMockProjects();
        return [];
      })
    ).subscribe(
      (projects) => {
        if (projects && projects.length > 0) {
          this.projects = projects;
          this.projectsSubject.next(this.projects);
          
          // Ustaw pierwszy projekt jako wybrany, jeśli jest jeden i żaden nie jest aktualnie wybrany
          if (this.projects.length > 0 && !this.selectedProjectSubject.value) {
            this.selectedProjectSubject.next(this.projects[0]);
          }
        } else {
          // Jeśli API zwróciło pustą listę, użyj danych przykładowych
          this.setupMockProjects();
        }
      }
    );
  }

  private setupMockProjects(): void {
    // Użyj przykładowych danych projektów
    this.projects = [
      { id: 'proj-1', name: 'Portal klienta', color: 'green', description: 'Aplikacja internetowa dla klientów' },
      { id: 'proj-2', name: 'Aplikacja mobilna', color: 'purple', description: 'Aplikacja na iOS i Android' },
      { id: 'proj-3', name: 'Backend API', color: 'blue', description: 'REST API dla wszystkich aplikacji' }
    ];
    this.projectsSubject.next(this.projects);
    
    // Ustaw pierwszy projekt jako wybrany
    if (this.projects.length > 0) {
      this.selectedProjectSubject.next(this.projects[0]);
    }
  }
  
  get projects$(): Observable<Project[]> {
    return this.projectsSubject.asObservable();
  }
  
  get selectedProject$(): Observable<Project | null> {
    return this.selectedProjectSubject.asObservable();
  }
  
  selectProject(projectId: string): void {
    const project = this.projects.find(p => p.id === projectId) || null;
    this.selectedProjectSubject.next(project);
  }
  
  addProject(project: Omit<Project, 'id'>): void {
    this.apiService.createProject(project).subscribe(
      (newProject) => {
        this.projects = [...this.projects, newProject];
        this.projectsSubject.next(this.projects);
      },
      (error) => {
        console.error('Błąd podczas tworzenia projektu:', error);
        // W przypadku błędu API, dodaj projekt z wygenerowanym ID lokalnie
        const mockProject = {
          ...project,
          id: `proj-${this.projects.length + 1}`
        };
        this.projects = [...this.projects, mockProject];
        this.projectsSubject.next(this.projects);
      }
    );
  }
  
  updateProject(id: string, project: Partial<Project>): void {
    this.apiService.updateProject(id, project).subscribe(
      (updatedProject) => {
        this.projects = this.projects.map(p => 
          p.id === id ? { ...p, ...updatedProject } : p
        );
        this.projectsSubject.next(this.projects);
        
        // Zaktualizuj wybrany projekt, jeśli to jest ten, który został zaktualizowany
        const currentSelected = this.selectedProjectSubject.value;
        if (currentSelected && currentSelected.id === id) {
          this.selectedProjectSubject.next({ ...currentSelected, ...updatedProject });
        }
      },
      (error) => {
        console.error('Błąd podczas aktualizacji projektu:', error);
        // W przypadku błędu API, zaktualizuj projekt lokalnie
        this.projects = this.projects.map(p => 
          p.id === id ? { ...p, ...project } : p
        );
        this.projectsSubject.next(this.projects);
        
        // Zaktualizuj wybrany projekt, jeśli to jest ten, który został zaktualizowany
        const currentSelected = this.selectedProjectSubject.value;
        if (currentSelected && currentSelected.id === id) {
          this.selectedProjectSubject.next({ ...currentSelected, ...project });
        }
      }
    );
  }
  
  deleteProject(id: string): void {
    this.apiService.deleteProject(id).subscribe(
      () => {
        this.projects = this.projects.filter(p => p.id !== id);
        this.projectsSubject.next(this.projects);
        
        // Zresetuj wybór, jeśli usunięty projekt był wybrany
        const currentSelected = this.selectedProjectSubject.value;
        if (currentSelected && currentSelected.id === id) {
          this.selectedProjectSubject.next(this.projects[0] || null);
        }
      },
      (error) => {
        console.error('Błąd podczas usuwania projektu:', error);
        // W przypadku błędu API, usuń projekt lokalnie
        this.projects = this.projects.filter(p => p.id !== id);
        this.projectsSubject.next(this.projects);
        
        // Zresetuj wybór, jeśli usunięty projekt był wybrany
        const currentSelected = this.selectedProjectSubject.value;
        if (currentSelected && currentSelected.id === id) {
          this.selectedProjectSubject.next(this.projects[0] || null);
        }
      }
    );
  }
}
