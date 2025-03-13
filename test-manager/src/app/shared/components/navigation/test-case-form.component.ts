import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '../../../shared/ui/page-header/page-header.component';
import { ApiService } from '../../../core/services/api.service';
import { ProjectService, Project } from '../../../core/services/project.service';
import { TestCase } from '../../../core/models/test-case.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-test-case-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule,
    PageHeaderComponent
  ],
  template: `
    <div class="test-case-form-container">
      <app-page-header [title]="isEditMode ? 'Edytuj przypadek testowy' : 'Nowy przypadek testowy'">
        <button mat-stroked-button (click)="cancel()">
          <mat-icon>close</mat-icon>
          <span>Anuluj</span>
        </button>
        <button mat-flat-button color="primary" [disabled]="testCaseForm.invalid || isSubmitting" (click)="saveTestCase()">
          <mat-icon>save</mat-icon>
          <span>{{ isEditMode ? 'Zapisz zmiany' : 'Utwórz' }}</span>
        </button>
      </app-page-header>

      <form [formGroup]="testCaseForm" (ngSubmit)="saveTestCase()">
        <div class="form-grid">
          <mat-card class="basic-info-card">
            <mat-card-content>
              <h3>Podstawowe informacje</h3>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Nazwa przypadku testowego</mat-label>
                <input matInput formControlName="name" placeholder="Np. Logowanie użytkownika">
                <mat-error *ngIf="testCaseForm.get('name')?.hasError('required')">
                  Nazwa jest wymagana
                </mat-error>
              </mat-form-field>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Projekt</mat-label>
                  <mat-select formControlName="project">
                    <mat-select-trigger>
                      <div class="project-option" *ngIf="testCaseForm.get('project')?.value">
                        <div class="color-dot" [ngClass]="getProjectColor(testCaseForm.get('project')?.value)"></div>
                        <span>{{ getProjectName(testCaseForm.get('project')?.value) }}</span>
                      </div>
                    </mat-select-trigger>
                    <mat-option *ngFor="let project of projects" [value]="project.id">
                      <div class="project-option">
                        <div class="color-dot" [ngClass]="project.color"></div>
                        <span>{{ project.name }}</span>
                      </div>
                    </mat-option>
                  </mat-select>
                  <mat-error *ngIf="testCaseForm.get('project')?.hasError('required')">
                    Projekt jest wymagany
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Priorytet</mat-label>
                  <mat-select formControlName="priority">
                    <mat-option value="high">Wysoki</mat-option>
                    <mat-option value="medium">Średni</mat-option>
                    <mat-option value="low">Niski</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Opis</mat-label>
                <textarea matInput formControlName="description" rows="4"></textarea>
              </mat-form-field>

              <h3>Warunki wstępne</h3>
              <div formArrayName="preconditions" class="preconditions-list">
                <div *ngFor="let precondition of preconditionsArray.controls; let i = index" class="precondition-item">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Warunek {{ i + 1 }}</mat-label>
                    <input matInput [formControlName]="i">
                    <button mat-icon-button matSuffix type="button" (click)="removePrecondition(i)"
                           matTooltip="Usuń warunek" [disabled]="preconditionsArray.length <= 1">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </mat-form-field>
                </div>

                <button mat-stroked-button type="button" (click)="addPrecondition()" class="add-button">
                  <mat-icon>add</mat-icon> Dodaj warunek
                </button>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="steps-card">
            <mat-card-content>
              <h3>Kroki testowe</h3>

              <div formArrayName="steps" class="steps-list">
                <div *ngFor="let step of stepsArray.controls; let i = index" [formGroupName]="i" class="step-item">
                  <div class="step-header">
                    <div class="step-number">{{ i + 1 }}</div>
                    <button mat-icon-button type="button" (click)="removeStep(i)"
                           matTooltip="Usuń krok" [disabled]="stepsArray.length <= 1">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>

                  <div class="step-content">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Akcja</mat-label>
                      <textarea matInput formControlName="action" rows="2"></textarea>
                      <mat-error *ngIf="getStepControl(i).get('action')?.hasError('required')">
                        Akcja jest wymagana
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Oczekiwany rezultat</mat-label>
                      <textarea matInput formControlName="expected" rows="2"></textarea>
                      <mat-error *ngIf="getStepControl(i).get('expected')?.hasError('required')">
                        Oczekiwany rezultat jest wymagany
                      </mat-error>
                    </mat-form-field>
                  </div>
                </div>

                <button mat-stroked-button type="button" (click)="addStep()" class="add-button">
                  <mat-icon>add</mat-icon> Dodaj krok
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .test-case-form-container {
      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;

        @media (max-width: 992px) {
          grid-template-columns: 1fr;
        }
      }

      .full-width {
        width: 100%;
      }

      .form-row {
        display: flex;
        gap: 16px;

        mat-form-field {
          flex: 1;
        }

        @media (max-width: 600px) {
          flex-direction: column;
          gap: 0;
        }
      }

      h3 {
        font-size: 16px;
        font-weight: 500;
        margin-top: 0;
        margin-bottom: 16px;
      }

      .project-option {
        display: flex;
        align-items: center;

        .color-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 8px;

          &.green {
            background-color: #4caf50;
          }

          &.purple {
            background-color: #9c27b0;
          }

          &.blue {
            background-color: #2196f3;
          }
        }
      }

      .preconditions-list {
        margin-bottom: 16px;

        .precondition-item {
          margin-bottom: 8px;
        }
      }

      .steps-list {
        .step-item {
          display: flex;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.12);

          .dark-theme & {
            border-bottom-color: rgba(255, 255, 255, 0.12);
          }

          &:last-child {
            border-bottom: none;
          }

          .step-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-right: 16px;

            .step-number {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background-color: #f5f5f5;
              color: rgba(0, 0, 0, 0.87);
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 500;
              margin-bottom: 8px;

              .dark-theme & {
                background-color: #424242;
                color: rgba(255, 255, 255, 0.87);
              }
            }
          }

          .step-content {
            flex: 1;
          }
        }
      }

      .add-button {
        margin-top: 8px;
      }
    }
  `]
})
export class TestCaseFormComponent implements OnInit {
  testCaseForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  testCaseId: string | null = null;
  projects: Project[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private projectService: ProjectService,
    private snackBar: MatSnackBar
  ) {
    this.testCaseForm = this.createForm();
  }

  ngOnInit() {
    this.projectService.projects$.subscribe(projects => {
      this.projects = projects;
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.testCaseId = id;

      if (id) {
        this.isEditMode = true;
        this.loadTestCase(id);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      project: ['', Validators.required],
      priority: ['medium'],
      description: [''],
      preconditions: this.fb.array([
        this.fb.control('')
      ]),
      steps: this.fb.array([
        this.createStepGroup()
      ])
    });
  }

  createStepGroup(): FormGroup {
    return this.fb.group({
      action: ['', Validators.required],
      expected: ['', Validators.required]
    });
  }

  get preconditionsArray(): FormArray {
    return this.testCaseForm.get('preconditions') as FormArray;
  }

  get stepsArray(): FormArray {
    return this.testCaseForm.get('steps') as FormArray;
  }

  getStepControl(index: number): FormGroup {
    return this.stepsArray.at(index) as FormGroup;
  }

  addPrecondition(): void {
    this.preconditionsArray.push(this.fb.control(''));
  }

  removePrecondition(index: number): void {
    if (this.preconditionsArray.length > 1) {
      this.preconditionsArray.removeAt(index);
    }
  }

  addStep(): void {
    this.stepsArray.push(this.createStepGroup());
  }

  removeStep(index: number): void {
    if (this.stepsArray.length > 1) {
      this.stepsArray.removeAt(index);
    }
  }

  loadTestCase(id: string): void {
    this.apiService.getTestCaseById(id).subscribe(testCase => {
      // In a real application, you would map the test case data to the form
      // This is a simplified example
      this.testCaseForm.patchValue({
        name: testCase.name,
        project: 'proj-1', // Assuming this is the project ID
        priority: 'high', // Simplified mapping
        description: 'Ten przypadek testowy weryfikuje poprawność działania funkcji logowania użytkownika na portalu klienta.'
      });

      // Clear and repopulate preconditions
      while (this.preconditionsArray.length > 0) {
        this.preconditionsArray.removeAt(0);
      }

      ['Portal klienta jest dostępny', 'Użytkownik posiada konto w systemie'].forEach(precondition => {
        this.preconditionsArray.push(this.fb.control(precondition));
      });

      // Clear and repopulate steps
      while (this.stepsArray.length > 0) {
        this.stepsArray.removeAt(0);
      }

      [
        { action: 'Przejdź do strony logowania portalu', expected: 'Strona logowania wyświetla się poprawnie' },
        { action: 'Wprowadź poprawny login i hasło', expected: 'Pola przyjmują wprowadzane wartości' },
        { action: 'Kliknij przycisk "Zaloguj"', expected: 'Użytkownik zostaje zalogowany i przekierowany do strony głównej' }
      ].forEach(step => {
        this.stepsArray.push(
          this.fb.group({
            action: [step.action, Validators.required],
            expected: [step.expected, Validators.required]
          })
        );
      });
    });
  }

  getProjectName(projectId: string): string {
    const project = this.projects.find(p => p.id === projectId);
    return project ? project.name : '';
  }

  getProjectColor(projectId: string): string {
    const project = this.projects.find(p => p.id === projectId);
    return project ? project.color : '';
  }

  saveTestCase(): void {
    if (this.testCaseForm.invalid) {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.testCaseForm);
      this.snackBar.open('Proszę poprawić błędy w formularzu', 'OK', { duration: 3000 });
      return;
    }

    this.isSubmitting = true;

    const formValue = this.testCaseForm.value;
    const testCaseData = {
      name: formValue.name,
      project: formValue.project,
      priority: formValue.priority,
      description: formValue.description,
      preconditions: formValue.preconditions,
      steps: formValue.steps
    };

    if (this.isEditMode && this.testCaseId) {
      this.apiService.updateTestCase(this.testCaseId, testCaseData)
        .pipe(finalize(() => this.isSubmitting = false))
        .subscribe(
          result => {
            this.snackBar.open('Przypadek testowy został zaktualizowany', 'OK', { duration: 3000 });
            this.router.navigate(['/test-cases/view', this.testCaseId]);
          },
          error => {
            this.snackBar.open('Wystąpił błąd podczas aktualizacji', 'OK', { duration: 3000 });
          }
        );
    } else {
      this.apiService.createTestCase(testCaseData)
        .pipe(finalize(() => this.isSubmitting = false))
        .subscribe(
          result => {
            this.snackBar.open('Przypadek testowy został utworzony', 'OK', { duration: 3000 });
            this.router.navigate(['/test-cases/view', result.id]);
          },
          error => {
            this.snackBar.open('Wystąpił błąd podczas tworzenia', 'OK', { duration: 3000 });
          }
        );
    }
  }

  cancel(): void {
    if (this.isEditMode && this.testCaseId) {
      this.router.navigate(['/test-cases/view', this.testCaseId]);
    } else {
      this.router.navigate(['/test-cases']);
    }
  }

  // Helper method to mark all controls in a form group as touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
