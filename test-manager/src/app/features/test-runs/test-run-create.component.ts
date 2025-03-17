import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { StatusChipComponent } from '../../shared/ui/status-chip/status-chip.component';
import { ProjectService, Project } from '../../core/services/project.service';
import { ApiService } from '../../core/services/api.service';
import { TestCase } from '../../core/models/test-case.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { getStatusColorClass } from '../../shared/utils/color-utils';
import {MatDivider} from '@angular/material/divider';


@Component({
  selector: 'app-test-run-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatSnackBarModule,
    PageHeaderComponent,
    StatusChipComponent,
    MatDivider
  ],
  template: `
    <div class="test-run-create-container">
      <app-page-header [title]="isEditMode ? 'Edytuj wykonanie testów' : 'Nowe wykonanie testów'">
        <button mat-stroked-button (click)="cancel()">
          <mat-icon>close</mat-icon>
          <span>Anuluj</span>
        </button>
      </app-page-header>

      <mat-stepper [linear]="true" #stepper>
        <mat-step [stepControl]="basicInfoForm">
          <ng-template matStepLabel>Informacje podstawowe</ng-template>

          <form [formGroup]="basicInfoForm" class="step-content">
            <mat-card class="form-card">
              <mat-card-content>
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Nazwa wykonania</mat-label>
                  <input matInput formControlName="name" placeholder="Np. Testy regresyjne - wersja 1.5.0">
                  <mat-error *ngIf="basicInfoForm.get('name')?.hasError('required')">
                    Nazwa jest wymagana
                  </mat-error>
                </mat-form-field>

                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Projekt</mat-label>
                    <mat-select formControlName="project">
                      <mat-option *ngFor="let project of projects" [value]="project.id">
                        <div class="project-option">
                          <div class="color-dot" [ngClass]="project.color"></div>
                          <span>{{ project.name }}</span>
                        </div>
                      </mat-option>
                    </mat-select>
                    <mat-error *ngIf="basicInfoForm.get('project')?.hasError('required')">
                      Projekt jest wymagany
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Środowisko</mat-label>
                    <mat-select formControlName="environment">
                      <mat-option value="development">Deweloperskie</mat-option>
                      <mat-option value="test">Testowe</mat-option>
                      <mat-option value="staging">Przedprodukcyjne</mat-option>
                      <mat-option value="production">Produkcyjne</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Opis</mat-label>
                  <textarea matInput formControlName="description" rows="3" placeholder="Opisz cel i zakres tego wykonania testów"></textarea>
                </mat-form-field>

                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Data początkowa</mat-label>
                    <input matInput [matDatepicker]="startPicker" formControlName="startDate">
                    <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                    <mat-datepicker #startPicker></mat-datepicker>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Data końcowa</mat-label>
                    <input matInput [matDatepicker]="endPicker" formControlName="endDate">
                    <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                    <mat-datepicker #endPicker></mat-datepicker>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <div class="checkbox-group">
                    <mat-checkbox formControlName="autoExecute">Automatycznie wykonaj</mat-checkbox>
                    <mat-checkbox formControlName="notifyOnCompletion">Powiadom po zakończeniu</mat-checkbox>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <div class="step-actions">
              <span class="spacer"></span>
              <button mat-flat-button color="primary" matStepperNext [disabled]="basicInfoForm.invalid">
                Dalej <mat-icon>arrow_forward</mat-icon>
              </button>
            </div>
          </form>
        </mat-step>

        <mat-step [stepControl]="testSelectionForm">
          <ng-template matStepLabel>Wybór testów</ng-template>

          <form [formGroup]="testSelectionForm" class="step-content">
            <mat-card class="form-card">
              <mat-card-content>
                <div class="selection-methods">
                  <button mat-stroked-button [class.active]="selectionMethod === 'manual'" (click)="setSelectionMethod('manual')">
                    <mat-icon>list</mat-icon>
                    <span>Wybór ręczny</span>
                  </button>
                  <button mat-stroked-button [class.active]="selectionMethod === 'filter'" (click)="setSelectionMethod('filter')">
                    <mat-icon>filter_list</mat-icon>
                    <span>Filtrowanie</span>
                  </button>
                  <button mat-stroked-button [class.active]="selectionMethod === 'import'" (click)="setSelectionMethod('import')">
                    <mat-icon>file_upload</mat-icon>
                    <span>Import</span>
                  </button>
                </div>

                <div class="selection-container" [ngSwitch]="selectionMethod">
                  <div *ngSwitchCase="'manual'" class="manual-selection">
                    <div class="search-container">
                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Wyszukaj testy</mat-label>
                        <input matInput placeholder="Wpisz nazwę lub ID testu" [formControl]="searchControl">
                        <mat-icon matSuffix>search</mat-icon>
                      </mat-form-field>
                    </div>

                    <div class="test-list">
                      <div class="test-item" *ngFor="let test of filteredTests">
                        <mat-checkbox [checked]="isTestSelected(test.id)" (change)="toggleTestSelection(test)">
                          <div class="test-info">
                            <div class="test-title">
                              <span class="test-id">{{ test.id }}:</span> {{ test.name }}
                            </div>
                            <div class="test-meta">
                              <div class="project-indicator">
                                <div class="color-dot" [ngClass]="test.project.color"></div>
                                <span>{{ test.project.name }}</span>
                              </div>
                              <app-status-chip [text]="test.priority.level" [color]="getStatusColorClass(test.priority.color)"></app-status-chip>
                            </div>
                          </div>
                        </mat-checkbox>
                      </div>
                    </div>
                  </div>

                  <div *ngSwitchCase="'filter'" class="filter-selection">
                    <div class="filters-container" formGroupName="filters">
                      <mat-form-field appearance="outline">
                        <mat-label>Projekt</mat-label>
                        <mat-select formControlName="project">
                          <mat-option value="">Wszystkie projekty</mat-option>
                          <mat-option *ngFor="let project of projects" [value]="project.id">{{ project.name }}</mat-option>
                        </mat-select>
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Priorytet</mat-label>
                        <mat-select formControlName="priority">
                          <mat-option value="">Wszystkie priorytety</mat-option>
                          <mat-option value="high">Wysoki</mat-option>
                          <mat-option value="medium">Średni</mat-option>
                          <mat-option value="low">Niski</mat-option>
                        </mat-select>
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Status</mat-label>
                        <mat-select formControlName="status">
                          <mat-option value="">Wszystkie statusy</mat-option>
                          <mat-option value="active">Aktywny</mat-option>
                          <mat-option value="review">W przeglądzie</mat-option>
                          <mat-option value="inactive">Nieaktywny</mat-option>
                        </mat-select>
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Autor</mat-label>
                        <mat-select formControlName="author">
                          <mat-option value="">Wszyscy autorzy</mat-option>
                          <mat-option value="Jan Kowalski">Jan Kowalski</mat-option>
                          <mat-option value="Anna Nowak">Anna Nowak</mat-option>
                          <mat-option value="Piotr Wiśniewski">Piotr Wiśniewski</mat-option>
                        </mat-select>
                      </mat-form-field>
                    </div>

                    <div class="filter-actions">
                      <button mat-stroked-button (click)="clearFilters()">
                        <mat-icon>clear</mat-icon>
                        <span>Wyczyść filtry</span>
                      </button>
                      <button mat-flat-button color="primary" (click)="applyFilters()">
                        <mat-icon>filter_list</mat-icon>
                        <span>Zastosuj filtry</span>
                      </button>
                    </div>

                    <div class="filtered-tests">
                      <div class="filtered-tests-header">
                        <h3>Wyniki filtrowania ({{ filteredTests.length }} testów)</h3>
                        <button mat-stroked-button color="primary" (click)="selectAllFiltered()">
                          <mat-icon>select_all</mat-icon>
                          <span>Wybierz wszystkie</span>
                        </button>
                      </div>

                      <div class="test-list" *ngIf="filteredTests.length > 0">
                        <div class="test-item" *ngFor="let test of filteredTests">
                          <mat-checkbox [checked]="isTestSelected(test.id)" (change)="toggleTestSelection(test)">
                            <div class="test-info">
                              <div class="test-title">
                                <span class="test-id">{{ test.id }}:</span> {{ test.name }}
                              </div>
                              <div class="test-meta">
                                <div class="project-indicator">
                                  <div class="color-dot" [ngClass]="test.project.color"></div>
                                  <span>{{ test.project.name }}</span>
                                </div>
                                <app-status-chip [text]="test.priority.level" [color]="getStatusColorClass(test.priority.color)"></app-status-chip>
                              </div>
                            </div>
                          </mat-checkbox>
                        </div>
                      </div>

                      <div class="no-tests" *ngIf="filteredTests.length === 0">
                        <mat-icon>search_off</mat-icon>
                        <p>Nie znaleziono testów spełniających kryteria filtrowania</p>
                      </div>
                    </div>
                  </div>

                  <div *ngSwitchCase="'import'" class="import-selection">
                    <div class="import-container">
                      <div class="import-actions">
                        <button mat-stroked-button color="primary">
                          <mat-icon>upload_file</mat-icon>
                          <span>Wybierz plik</span>
                        </button>
                        <p class="import-hint">Obsługiwane formaty: .csv, .xlsx</p>
                      </div>

                      <mat-divider></mat-divider>

                      <div class="import-placeholder">
                        <mat-icon>cloud_upload</mat-icon>
                        <p>Przeciągnij i upuść plik tutaj lub kliknij przycisk powyżej, aby wybrać plik z komputera</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="selection-summary">
                  <h3>Wybrane testy ({{ selectedTests.length }})</h3>

                  <div class="selected-tests-list" *ngIf="selectedTests.length > 0">
                    <div class="selected-test-item" *ngFor="let test of selectedTests">
                      <div class="test-info">
                        <div class="test-title">
                          <span class="test-id">{{ test.id }}:</span> {{ test.name }}
                        </div>
                        <div class="test-meta">
                          <div class="project-indicator">
                            <div class="color-dot" [ngClass]="test.project.color"></div>
                            <span>{{ test.project.name }}</span>
                          </div>
                        </div>
                      </div>
                      <button mat-icon-button color="warn" (click)="removeTest(test)" matTooltip="Usuń test">
                        <mat-icon>close</mat-icon>
                      </button>
                    </div>
                  </div>

                  <div class="no-tests" *ngIf="selectedTests.length === 0">
                    <mat-icon>playlist_add</mat-icon>
                    <p>Nie wybrano jeszcze żadnych testów</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <div class="step-actions">
              <button mat-stroked-button matStepperPrevious>
                <mat-icon>arrow_back</mat-icon> Wróć
              </button>
              <span class="spacer"></span>
              <button mat-flat-button color="primary" matStepperNext [disabled]="selectedTests.length === 0">
                Dalej <mat-icon>arrow_forward</mat-icon>
              </button>
            </div>
          </form>
        </mat-step>

        <mat-step>
          <ng-template matStepLabel>Podsumowanie</ng-template>

          <div class="step-content">
            <mat-card class="form-card">
              <mat-card-content>
                <div class="summary-header">
                  <h3>Podsumowanie wykonania testów</h3>
                </div>

                <div class="summary-section">
                  <h4>Informacje podstawowe</h4>

                  <div class="summary-row">
                    <div class="summary-label">Nazwa:</div>
                    <div class="summary-value">{{ basicInfoForm.get('name')?.value }}</div>
                  </div>

                  <div class="summary-row">
                    <div class="summary-label">Projekt:</div>
                    <div class="summary-value">
                      <div class="project-indicator">
                        <div class="color-dot" [ngClass]="getProjectColor(basicInfoForm.get('project')?.value)"></div>
                        <span>{{ getProjectName(basicInfoForm.get('project')?.value) }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="summary-row">
                    <div class="summary-label">Środowisko:</div>
                    <div class="summary-value">{{ getEnvironmentName(basicInfoForm.get('environment')?.value) }}</div>
                  </div>

                  <div class="summary-row">
                    <div class="summary-label">Okres:</div>
                    <div class="summary-value">
                      {{ formatDate(basicInfoForm.get('startDate')?.value) }} - {{ formatDate(basicInfoForm.get('endDate')?.value) }}
                    </div>
                  </div>

                  <div class="summary-row">
                    <div class="summary-label">Opis:</div>
                    <div class="summary-value description">{{ basicInfoForm.get('description')?.value || 'Brak opisu' }}</div>
                  </div>
                </div>

                <mat-divider class="summary-divider"></mat-divider>

                <div class="summary-section">
                  <h4>Wybrane testy ({{ selectedTests.length }})</h4>

                  <div class="selected-tests-summary" *ngIf="selectedTests.length > 0">
                    <table class="summary-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Nazwa</th>
                          <th>Projekt</th>
                          <th>Priorytet</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let test of selectedTests">
                          <td>{{ test.id }}</td>
                          <td>{{ test.name }}</td>
                          <td>
                            <div class="project-indicator">
                              <div class="color-dot" [ngClass]="test.project.color"></div>
                              <span>{{ test.project.name }}</span>
                            </div>
                          </td>
                          <td>
                            <app-status-chip [text]="test.priority.level" [color]="getStatusColorClass(test.priority.color)"></app-status-chip>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <div class="step-actions">
              <button mat-stroked-button matStepperPrevious>
                <mat-icon>arrow_back</mat-icon> Wróć
              </button>
              <span class="spacer"></span>
              <button mat-stroked-button (click)="stepper.reset()">
                <mat-icon>refresh</mat-icon> Rozpocznij od nowa
              </button>
              <button mat-flat-button color="primary" (click)="saveTestRun()">
                <mat-icon>check</mat-icon> Utwórz wykonanie
              </button>
            </div>
          </div>
        </mat-step>
      </mat-stepper>
    </div>
  `,
  styles: [`
    .test-run-create-container {
      .step-content {
        margin: 16px 0;
        display: flex;
        flex-direction: column;
        gap: 16px;
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

        .checkbox-group {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          align-items: center;
          margin-top: 8px;
        }
      }

      .step-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .spacer {
          flex: 1;
        }
      }

      .project-option, .project-indicator {
        display: flex;
        align-items: center;

        .color-dot {
          width: 12px;
          height: 12px;
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

      .selection-methods {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;

        button {
          flex: 1;
          min-width: 120px;

          &.active {
            background-color: rgba(63, 81, 181, 0.1);
          }
        }
      }

      .selection-container {
        margin-bottom: 16px;

        .manual-selection, .filter-selection, .import-selection {
          padding: 16px 0;
        }

        .search-container {
          margin-bottom: 16px;
        }

        .test-list {
          max-height: 300px;
          overflow-y: auto;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 4px;

          .dark-theme & {
            border-color: rgba(255, 255, 255, 0.12);
          }

          .test-item {
            padding: 12px 16px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.12);

            .dark-theme & {
              border-bottom-color: rgba(255, 255, 255, 0.12);
            }

            &:last-child {
              border-bottom: none;
            }

            .test-info {
              display: flex;
              flex-direction: column;

              .test-title {
                margin-bottom: 4px;

                .test-id {
                  font-family: monospace;
                  color: var(--text-secondary);
                }
              }

              .test-meta {
                display: flex;
                align-items: center;
                font-size: 12px;

                .project-indicator {
                  margin-right: 8px;
                }
              }
            }
          }
        }

        .filters-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }

        .filter-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-bottom: 16px;
        }

        .filtered-tests {
          .filtered-tests-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;

            h3 {
              font-size: 16px;
              font-weight: 500;
              margin: 0;
            }
          }
        }

        .no-tests {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px 0;
          color: var(--text-secondary);

          mat-icon {
            font-size: 48px;
            width: 48px;
            height: 48px;
            margin-bottom: 16px;
            opacity: 0.5;
          }

          p {
            font-size: 16px;
            margin: 0;
          }
        }

        .import-container {
          .import-actions {
            display: flex;
            align-items: center;
            margin-bottom: 16px;

            .import-hint {
              margin: 0 0 0 16px;
              font-size: 14px;
              color: var(--text-secondary);
            }
          }

          .import-placeholder {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 200px;
            border: 2px dashed rgba(0, 0, 0, 0.12);
            border-radius: 4px;
            margin-top: 16px;
            padding: 16px;

            .dark-theme & {
              border-color: rgba(255, 255, 255, 0.12);
            }

            mat-icon {
              font-size: 48px;
              width: 48px;
              height: 48px;
              margin-bottom: 16px;
              opacity: 0.5;
            }

            p {
              text-align: center;
              color: var(--text-secondary);
              margin: 0;
            }
          }
        }
      }

      .selection-summary {
        h3 {
          font-size: 16px;
          font-weight: 500;
          margin: 0 0 16px;
        }

        .selected-tests-list {
          max-height: 200px;
          overflow-y: auto;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 4px;

          .dark-theme & {
            border-color: rgba(255, 255, 255, 0.12);
          }

          .selected-test-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.12);

            .dark-theme & {
              border-bottom-color: rgba(255, 255, 255, 0.12);
            }

            &:last-child {
              border-bottom: none;
            }

            .test-info {
              .test-title {
                margin-bottom: 4px;

                .test-id {
                  font-family: monospace;
                  color: var(--text-secondary);
                }
              }

              .test-meta {
                display: flex;
                align-items: center;
                font-size: 12px;
              }
            }
          }
        }
      }

      .summary-header {
        h3 {
          font-size: 18px;
          font-weight: 500;
          margin: 0 0 16px;
        }
      }

      .summary-section {
        margin-bottom: 24px;

        h4 {
          font-size: 16px;
          font-weight: 500;
          margin: 0 0 16px;
          color: var(--text-secondary);
        }

        .summary-row {
          display: flex;
          margin-bottom: 8px;

          .summary-label {
            width: 120px;
            font-weight: 500;
          }

          .summary-value {
            flex: 1;

            &.description {
              white-space: pre-line;
            }
          }
        }

        .summary-divider {
          margin: 24px 0;
        }

        .summary-table {
          width: 100%;
          border-collapse: collapse;

          th, td {
            padding: 12px 16px;
            text-align: left;
            border-bottom: 1px solid rgba(0, 0, 0, 0.12);

            .dark-theme & {
              border-bottom-color: rgba(255, 255, 255, 0.12);
            }
          }

          th {
            font-weight: 500;
            color: var(--text-secondary);
          }
        }
      }
    }
  `]
})
export class TestRunCreateComponent implements OnInit {
  isEditMode = false;
  basicInfoForm: FormGroup;
  testSelectionForm: FormGroup;
  searchControl!: FormControl<string | null>;

  projects: Project[] = [];
  selectionMethod = 'manual';

  allTests: TestCase[] = [];
  filteredTests: TestCase[] = [];
  selectedTests: TestCase[] = [];

  filteredOptions: Observable<TestCase[]> | undefined;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private projectService: ProjectService,
    private snackBar: MatSnackBar
  ) {
    this.basicInfoForm = this.createBasicInfoForm();
    this.testSelectionForm = this.createTestSelectionForm();
    this.searchControl = this.fb.control('');
  }

  ngOnInit() {
    this.projectService.projects$.subscribe(projects => {
      this.projects = projects;
    });

    this.apiService.getTestCases().subscribe(testCases => {
      this.allTests = testCases;
      this.filteredTests = [...testCases];

      // Check if there is a test case ID in query params
      this.route.queryParams.subscribe(params => {
        if (params['testCaseId']) {
          const testCase = this.allTests.find(t => t.id === params['testCaseId']);
          if (testCase) {
            this.selectedTests.push(testCase);

            // Set project in basic info form
            if (testCase.project && typeof testCase.project === 'object') {
              const projectId = this.projects.find(p => p.name === testCase.project.name)?.id;
              if (projectId) {
                this.basicInfoForm.patchValue({ project: projectId });
              }
            }
          }
        }
      });
    });

    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );

    this.searchControl.valueChanges.subscribe(value => {
      this.filteredTests = this._filter(value || '');
    });
  }


  private _filter(value: string): TestCase[] {
    const filterValue = value.toLowerCase();
    return this.allTests.filter(test =>
      test.name.toLowerCase().includes(filterValue) ||
      test.id.toLowerCase().includes(filterValue)
    );
  }

  createBasicInfoForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      project: ['', Validators.required],
      environment: ['test'],
      description: [''],
      startDate: [new Date()],
      endDate: [new Date(new Date().setDate(new Date().getDate() + 7))],
      autoExecute: [false],
      notifyOnCompletion: [true]
    });
  }

  createTestSelectionForm(): FormGroup {
    return this.fb.group({
      filters: this.fb.group({
        project: [''],
        priority: [''],
        status: [''],
        author: ['']
      })
    });
  }

  setSelectionMethod(method: string) {
    this.selectionMethod = method;
  }

  isTestSelected(testId: string): boolean {
    return this.selectedTests.some(t => t.id === testId);
  }

  toggleTestSelection(test: TestCase) {
    if (this.isTestSelected(test.id)) {
      this.removeTest(test);
    } else {
      this.selectedTests.push(test);
    }
  }

  removeTest(test: TestCase) {
    this.selectedTests = this.selectedTests.filter(t => t.id !== test.id);
  }

  clearFilters() {
    this.testSelectionForm.get('filters')?.reset({
      project: '',
      priority: '',
      status: '',
      author: ''
    });
    this.filteredTests = [...this.allTests];
  }

  applyFilters() {
    const filters = this.testSelectionForm.get('filters')?.value;
    this.filteredTests = this.allTests.filter(test => {
      let match = true;

      if (filters.project && test.project && typeof test.project === 'object') {
        const projectId = this.projects.find(p => p.name === test.project.name)?.id;
        if (projectId !== filters.project) {
          match = false;
        }
      }

      if (filters.priority && test.priority && typeof test.priority === 'object') {
        // Map UI priority values to API values
        const priorityMap: Record<string, string> = {
          'high': 'Wysoki',
          'medium': 'Średni',
          'low': 'Niski'
        };

        if (test.priority.level !== priorityMap[filters.priority]) {
          match = false;
        }
      }

      if (filters.status && test.status && typeof test.status === 'object') {
        // Map UI status values to API values
        const statusMap: Record<string, string> = {
          'active': 'Aktywny',
          'review': 'W przeglądzie',
          'inactive': 'Nieaktywny'
        };

        if (test.status.name !== statusMap[filters.status]) {
          match = false;
        }
      }

      if (filters.author && test.author !== filters.author) {
        match = false;
      }

      return match;
    });
  }

  selectAllFiltered() {
    // Add all filtered tests that aren't already selected
    this.filteredTests.forEach(test => {
      if (!this.isTestSelected(test.id)) {
        this.selectedTests.push(test);
      }
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

  getEnvironmentName(env: string): string {
    const environments: Record<string, string> = {
      'development': 'Deweloperskie',
      'test': 'Testowe',
      'staging': 'Przedprodukcyjne',
      'production': 'Produkcyjne'
    };

    return environments[env] || env;
  }

  formatDate(date: Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('pl-PL');
  }

  saveTestRun() {
    if (this.basicInfoForm.invalid) {
      this.snackBar.open('Proszę poprawić błędy w formularzu', 'OK', { duration: 3000 });
      return;
    }

    if (this.selectedTests.length === 0) {
      this.snackBar.open('Proszę wybrać co najmniej jeden test', 'OK', { duration: 3000 });
      return;
    }

    // In a real application, you would send the data to an API
    const formData = {
      ...this.basicInfoForm.value,
      tests: this.selectedTests.map(t => t.id)
    };

    console.log('Saving test run:', formData);

    this.snackBar.open('Wykonanie testów zostało utworzone', 'OK', { duration: 3000 });
    this.router.navigate(['/test-runs']);
  }

  cancel() {
    this.router.navigate(['/test-runs']);
  }

  getStatusColorClass(color: string): string {
    return getStatusColorClass(color);
  }
}
