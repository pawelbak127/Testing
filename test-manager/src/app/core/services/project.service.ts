import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { tap } from 'rxjs/operators';

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
    // Load projects from API when service is initialized
    this.loadProjects();
  }
  
  private loadProjects(): void {
    this.apiService.getProjects().subscribe(
      (projects) => {
        this.projects = projects;
        this.projectsSubject.next(this.projects);
        
        // Set first project as selected if there is one and none is currently selected
        if (this.projects.length > 0 && !this.selectedProjectSubject.value) {
          this.selectedProjectSubject.next(this.projects[0]);
        }
      },
      (error) => {
        console.error('Error loading projects:', error);
      }
    );
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
        console.error('Error creating project:', error);
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
        
        // Update selected project if it's the one being updated
        const currentSelected = this.selectedProjectSubject.value;
        if (currentSelected && currentSelected.id === id) {
          this.selectedProjectSubject.next({ ...currentSelected, ...updatedProject });
        }
      },
      (error) => {
        console.error('Error updating project:', error);
      }
    );
  }
  
  deleteProject(id: string): void {
    this.apiService.deleteProject(id).subscribe(
      () => {
        this.projects = this.projects.filter(p => p.id !== id);
        this.projectsSubject.next(this.projects);
        
        // Reset selection if the deleted project was selected
        const currentSelected = this.selectedProjectSubject.value;
        if (currentSelected && currentSelected.id === id) {
          this.selectedProjectSubject.next(this.projects[0] || null);
        }
      },
      (error) => {
        console.error('Error deleting project:', error);
      }
    );
  }
}
