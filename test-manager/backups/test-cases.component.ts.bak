import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StatusChipComponent } from '../../shared/ui/status-chip/status-chip.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { TestCase } from '../../core/models/test-case.model';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-test-cases',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    StatusChipComponent,
    PageHeaderComponent
  ],
  templateUrl: './test-cases.component.html',
  styleUrls: ['./test-cases.component.scss']
})
export class TestCasesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'project', 'priority', 'author', 'creationDate', 'status', 'actions'];
  dataSource = new MatTableDataSource<TestCase>([]);
  isLoading = true;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  projects = ['Wszystkie projekty', 'Portal klienta', 'Aplikacja mobilna', 'Backend API'];
  selectedProject = 'Wszystkie projekty';
  
  constructor(
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit() {
    this.loadTestCases();
  }
  
  loadTestCases() {
    this.isLoading = true;
    this.apiService.getTestCases().subscribe(
      testCases => {
        this.dataSource.data = testCases;
        this.isLoading = false;
      },
      error => {
        console.error('Błąd podczas pobierania przypadków testowych:', error);
        this.snackBar.open('Błąd podczas pobierania danych', 'OK', { duration: 3000 });
        this.isLoading = false;
      }
    );
  }
  
  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  filterByProject() {
    if (this.selectedProject === 'Wszystkie projekty') {
      this.dataSource.filter = '';
    } else {
      this.dataSource.filterPredicate = (data: TestCase, filter: string) => {
        return data.project.name === filter;
      };
      this.dataSource.filter = this.selectedProject;
    }
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  viewTestCase(id: string) {
    this.router.navigate(['/test-cases/view', id]);
  }
  
  editTestCase(id: string) {
    this.router.navigate(['/test-cases/edit', id]);
  }
  
  createTestCase() {
    this.router.navigate(['/test-cases/create']);
  }
  
  deleteTestCase(id: string) {
    if (confirm('Czy na pewno chcesz usunąć ten przypadek testowy?')) {
      this.apiService.deleteTestCase(id).subscribe(
        () => {
          this.snackBar.open('Przypadek testowy został usunięty', 'OK', { duration: 3000 });
          this.loadTestCases();
        },
        error => {
          console.error('Błąd podczas usuwania przypadku testowego:', error);
          this.snackBar.open('Błąd podczas usuwania przypadku testowego', 'OK', { duration: 3000 });
        }
      );
    }
  }
}
