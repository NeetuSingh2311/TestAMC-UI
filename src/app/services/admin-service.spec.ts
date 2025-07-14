import { TestBed } from '@angular/core/testing';
import { AdminService } from './admin-service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminService]
    });
    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
    sessionStorage.setItem('authUserEmail', 'test@example.com');
    sessionStorage.setItem('authPass', 'password123');
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getAllUsers with proper headers and return data', () => {
    const mockUsers = [
      { fullName: 'Alice', email: 'alice@example.com' },
      { fullName: 'Bob', email: 'bob@example.com' }
    ];

    service.getAllUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/admin/users');
    expect(req.request.method).toBe('GET');

    const expectedAuth = btoa('test@example.com:password123');
    expect(req.request.headers.get('Authorization')).toBe(`Basic ${expectedAuth}`);

    req.flush(mockUsers);
  });
});
