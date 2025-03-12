import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
  private projects: Project[] = [
    { id: 'proj-1', name: 'Portal klienta', color: 'green', description: 'Aplikacja internetowa dla klientów' },
    { id: 'proj-2', name: 'Aplikacja mobilna', color: 'purple', description: 'Aplikacja na iOS i Android' },
    { id: 'proj-3', name: 'Backend API', color: 'blue', description: 'REST API dla wszystkich aplikacji' }
  ];
  
  private projectsSubject = new BehaviorSubject<Project[]>(this.projects);
  private selectedProjectSubject = new BehaviorSubject<Project | null>(this.projects[0]);
  
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
    const newProject = {
      ...project,
      id: `proj-${this.projects.length + 1}`
    };
    this.projects = [...this.projects, newProject];
    this.projectsSubject.next(this.projects);
  }
  
  updateProject(id: string, project: Partial<Project>): void {
    this.projects = this.projects.map(p => 
      p.id === id ? { ...p, ...project } : p
    );
    this.projectsSubject.next(this.projects);
    
    // Jeśli aktualizujemy aktualnie wybrany projekt, aktualizujemy też selectedProject
    const currentSelected = this.selectedProjectSubject.value;
    if (currentSelected && currentSelected.id === id) {
      this.selectedProjectSubject.next({ ...currentSelected, ...project });
    }
  }
  
  deleteProject(id: string): void {
    this.projects = this.projects.filter(p => p.id !== id);
    this.projectsSubject.next(this.projects);
    
    // Jeśli usuwamy aktualnie wybrany projekt, resetujemy wybór
    const currentSelected = this.selectedProjectSubject.value;
    if (currentSelected && currentSelected.id === id) {
      this.selectedProjectSubject.next(this.projects[0] || null);
    }
  }
}
