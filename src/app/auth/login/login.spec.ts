import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Login } from './login';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Navbar } from '../../shared/navbar/navbar';
import { MaterialModule } from '../../../shared/material-module';
import { AdminDashboard } from '../../pages/admin-dashboard/admin-dashboard';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

class MockAuth {
  login = jasmine.createSpy();
}

class MockRouter {
  navigate = jasmine.createSpy();
}

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let mockAuth: MockAuth;
  let mockRouter: MockRouter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Login,Navbar,AdminDashboard],
      imports: [ReactiveFormsModule,MaterialModule,NoopAnimationsModule],
      providers: [
        FormBuilder,
        { provide: Auth, useClass: MockAuth },
        { provide: Router, useClass: MockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    mockAuth = TestBed.inject(Auth) as any;
    mockRouter = TestBed.inject(Router) as any;
    fixture.detectChanges();
  });

  it('should create the login form with email and password controls', () => {
    expect(component.loginForm.contains('email')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  it('should not submit if form is invalid', () => {
    spyOn(component, 'showNotificationBanner');
    component.loginForm.setValue({ email: '', password: '' });
    component.onSubmit();
    expect(mockAuth.login).not.toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

 

  it('should show error banner and set errorMessage for invalid role', () => {
    mockAuth.login.and.returnValue(of({ role: 'UNKNOWN' }));
    spyOn(component, 'showNotificationBanner').and.callThrough();
    component.loginForm.setValue({ email: 'x@test.com', password: 'pass' });
    component.onSubmit();
    expect(component.showNotificationBanner).toHaveBeenCalledWith('Password incorrect', 'error');
    expect(component.errorMessage).toBe('Invalid login credentials. Please try again.');
  });

  it('should show error banner and set errorMessage on login error', () => {
    mockAuth.login.and.returnValue(throwError(() => new Error('Login failed')));
    spyOn(component, 'showNotificationBanner').and.callThrough();
    component.loginForm.setValue({ email: 'fail@test.com', password: 'pass' });
    component.onSubmit();
    expect(component.showNotificationBanner).toHaveBeenCalledWith('Password incorrect', 'error');
    expect(component.errorMessage).toBe('Invalid login credentials. Please try again.');
    expect(component.loading).toBeFalse();
  });

  it('should hide banner after 5 seconds', fakeAsync(() => {
    component.showNotificationBanner('Test message', 'success');
    expect(component.showBanner).toBeTrue();
    tick(5000);
    expect(component.showBanner).toBeFalse();
  }));

  it('should navigate to "" on cancel', () => {
    component.onCancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });
});
