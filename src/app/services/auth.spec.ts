import { TestBed } from '@angular/core/testing';
import { Auth } from './auth';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('Auth Service', () => {
  let service: Auth;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Auth]
    });
    service = TestBed.inject(Auth);
    httpMock = TestBed.inject(HttpTestingController);
    sessionStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store user data in sessionStorage', () => {
    const credentials = { email: 'test@example.com', password: 'password123' };
    const mockResponse = { name: 'Test User', email: 'test@example.com', role: 'admin' };

    service.login(credentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(sessionStorage.getItem('userName')).toBe('Test User');
      expect(sessionStorage.getItem('authUserEmail')).toBe('test@example.com');
      expect(sessionStorage.getItem('authPass')).toBe('password123');
      expect(sessionStorage.getItem('userRole')).toBe('admin');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush(mockResponse);
  });

  it('should signup a user', () => {
    const signupData = { name: 'New User', email: 'new@example.com', password: 'pass' };
    const mockResponse = { success: true };

    service.signup(signupData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/auth/signup');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(signupData);
    req.flush(mockResponse);
  });

  it('should get user role, user name, and email from sessionStorage', () => {
    sessionStorage.setItem('userRole', 'admin');
    sessionStorage.setItem('userName', 'Test User');
    sessionStorage.setItem('authUserEmail', 'test@example.com');

    expect(service.getUserRole()).toBe('admin');
    expect(service.getUser()).toBe('Test User');
    expect(service.getEmail()).toBe('test@example.com');
  });

  it('should remove user info on logout', () => {
    sessionStorage.setItem('authUser', 'something');
    service.logout();
    expect(sessionStorage.getItem('authUser')).toBeNull();
  });

  it('should return true if user is logged in', () => {
    sessionStorage.setItem('userName', 'Test User');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return false if user is not logged in', () => {
    sessionStorage.removeItem('userName');
    expect(service.isLoggedIn()).toBeFalse();
  });
});
