import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Login } from './login';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authSpy: jasmine.SpyObj<Auth>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('Auth', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [Login],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Auth, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit if form is invalid', () => {
    component.loginForm.setValue({ email: '', password: '' });
    component.onSubmit();
    expect(authSpy.login).not.toHaveBeenCalled();
  });

  it('should login and navigate to retail-dashboard for USER role', fakeAsync(() => {
    component.loginForm.setValue({ email: 'user@example.com', password: 'pass' });
    const mockResponse = { role: 'USER' };
    authSpy.login.and.returnValue(of(mockResponse));

    component.onSubmit();
    tick();

    expect(authSpy.login).toHaveBeenCalledWith({ email: 'user@example.com', password: 'pass' });
    expect(sessionStorage.getItem('userRole')).toBe('USER');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['retail-dashboard']);
    expect(component.errorMessage).toBe('');
    expect(component.loading).toBeFalse();
  }));

  it('should login and navigate to admin-dashboard for ADMIN role', fakeAsync(() => {
    component.loginForm.setValue({ email: 'admin@example.com', password: 'adminpass' });
    const mockResponse = { role: 'ADMIN' };
    authSpy.login.and.returnValue(of(mockResponse));

    component.onSubmit();
    tick();

    expect(authSpy.login).toHaveBeenCalledWith({ email: 'admin@example.com', password: 'adminpass' });
    expect(sessionStorage.getItem('userRole')).toBe('ADMIN');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['admin-dashboard']);
    expect(component.errorMessage).toBe('');
    expect(component.loading).toBeFalse();
  }));

  it('should set errorMessage for invalid role in response', fakeAsync(() => {
    component.loginForm.setValue({ email: 'foo@example.com', password: 'bar' });
    const mockResponse = { role: 'GUEST' };
    authSpy.login.and.returnValue(of(mockResponse));

    component.onSubmit();
    tick();

    expect(component.errorMessage).toBe('Invalid login credentials. Please try again.');
    expect(component.loading).toBeFalse();
  }));

  it('should set errorMessage on login error', fakeAsync(() => {
    component.loginForm.setValue({ email: 'fail@example.com', password: 'fail' });
    authSpy.login.and.returnValue(throwError(() => new Error('Login failed')));

    component.onSubmit();
    tick();

    expect(component.errorMessage).toBe('Invalid login credentials. Please try again.');
    expect(component.loading).toBeFalse();
  }));

  it('should navigate to home on onCancel', () => {
    component.onCancel();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
  });
});
