import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StatusChipComponent } from '../../shared/ui/status-chip/status-chip.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { TestCase } from '../../core/models/test-case.model';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-test-cases',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    StatusChipComponent,
    PageHeaderComponent
  ],
  templateUrl: './test-cases.component.html',
  styleUrls: ['./test-cases.component.scss']
})
export class TestCasesComponent {
  displayedColumns: string[] = ['id', 'name', 'project', 'priority', 'author', 'creationDate', 'status'];
  dataSource = new MatTableDataSource<TestCase>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  projects = ['Wszystkie projekty', 'Portal klienta', 'Aplikacja mobilna', 'Backend API'];
  selectedProject = 'Wszystkie projekty';
  
  constructor(private apiService: ApiService) {}
  
  ngOnInit() {
    this.apiService.getTestCases().subscribe(testCases => {
      this.dataSource.data = testCases;
    });
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
