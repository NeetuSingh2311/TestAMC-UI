import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AdminDashboard } from './admin-dashboard';
import { AdminService } from '../../services/admin-service';
import { PortfolioService } from '../../services/portfolio-service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class MockAdminService {
  getAllUsers() {
    return of([
      { fullName: 'Alice', email: 'alice@example.com', pan: 'ABCDE1234F' },
      { fullName: 'Bob', email: 'bob@example.com', pan: 'XYZAB5678C' }
    ]);
  }
}

class MockPortfolioService {}

class MockRouter {
  navigate(path: string[]) {}
}

describe('AdminDashboard', () => {
  let component: AdminDashboard;
  let fixture: ComponentFixture<AdminDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminDashboard],
      imports: [
        ReactiveFormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AdminService, useClass: MockAdminService },
        { provide: PortfolioService, useClass: MockPortfolioService },
        { provide: Router, useClass: MockRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch users on init', fakeAsync(() => {
    spyOn(component, 'fetchUsers').and.callThrough();
    component.ngOnInit();
    tick();
    expect(component.fetchUsers).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(2);
  }));

  it('should filter users by query', () => {
    component.user = [
      { fullName: 'Alice', email: 'alice@example.com', pan: 'ABCDE1234F' },
      { fullName: 'Bob', email: 'bob@example.com', pan: 'XYZAB5678C' }
    ];
    component.filteredUsers('alice');
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].fullName).toBe('Alice');
  });

  it('should reset filter if query is empty', () => {
    component.user = [
      { fullName: 'Alice', email: 'alice@example.com', pan: 'ABCDE1234F' },
      { fullName: 'Bob', email: 'bob@example.com', pan: 'XYZAB5678C' }
    ];
    component.filteredUsers('');
    expect(component.dataSource.data.length).toBe(2);
  });

  it('should navigate to retail-dashboard on viewUserPortfolio', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    const user = { email: 'alice@example.com', fullName: 'Alice' };
    component.viewUserPortfolio(user);
    expect(sessionStorage.getItem('rowEmail')).toBe('alice@example.com');
    expect(sessionStorage.getItem('rowUserName')).toBe('Alice');
    expect(router.navigate).toHaveBeenCalledWith(['/retail-dashboard']);
  });
});
