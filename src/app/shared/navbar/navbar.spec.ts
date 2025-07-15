import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Auth } from "../../services/auth";
import { Navbar } from "./navbar";
import { MaterialModule } from "../../../shared/material-module";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Subject } from "rxjs";
import { HoldingDetails } from "../../pages/holding-details/holding-details";

class MockRouter {
  url = '';
  events = new Subject<any>();
  navigate = jasmine.createSpy();
}

class MockAuth {
  getUser = jasmine.createSpy().and.returnValue('Test User');
  getUserRole = jasmine.createSpy().and.returnValue('ADMIN');
  logout = jasmine.createSpy();
}

describe('Navbar', () => {
  let component: Navbar
  let fixture: ComponentFixture<Navbar>;
  let mockAuth: any;
  let mockRouter: any;
  let mockActivatedRoute: any = {
    snapshot: {
      params: {}
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Navbar,HoldingDetails],
      providers: [
        { provide: Auth, useClass: MockAuth },
        { provide: Router, useClass: MockRouter },
         { provide: ActivatedRoute,useValue:mockActivatedRoute }
      ],
      imports: [MaterialModule,HttpClientTestingModule]

    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    mockAuth = TestBed.inject(Auth) as any;
    mockRouter = TestBed.inject(Router) as any;
  });

  it('should initialize userName and userRole', () => {
    component.ngOnInit();
    expect(component.userName).toBe('Test User');
    expect(component.userRole).toBe('ADMIN');
  });

  it('should show back button for /holdings', () => {
    mockRouter.url = '/holdings';
    component.ngOnInit();
    expect(component.showBackButton).toBeTrue();
  });

  it('should show back button for /retail-dashboard if ADMIN', () => {
    mockRouter.url = '/retail-dashboard';
    mockAuth.getUserRole.and.returnValue('ADMIN');
    component.ngOnInit();
    expect(component.showBackButton).toBeTrue();
  });

  it('should not show back button for /retail-dashboard if not ADMIN', () => {
    mockRouter.url = '/retail-dashboard';
    mockAuth.getUserRole.and.returnValue('USER');
    component.ngOnInit();
    expect(component.showBackButton).toBeFalse();
  });

  it('should navigate to /admin-dashboard if on /retail-dashboard as ADMIN', () => {
    mockRouter.url = '/retail-dashboard';
    mockAuth.getUserRole.and.returnValue('ADMIN');
    component.goToRetailDashboard();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin-dashboard']);
  });

  it('should call window.history.back if not on /retail-dashboard as ADMIN', () => {
    spyOn(window.history, 'back');
    mockRouter.url = '/some-other-url';
    mockAuth.getUserRole.and.returnValue('USER');
    component.goToRetailDashboard();
    expect(window.history.back).toHaveBeenCalled();
  });

  it('should logout and navigate to /login', () => {
    component.logout();
    expect(mockAuth.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should update back button visibility on NavigationEnd event', () => {
    mockRouter.url = '/holdings';
    component.ngOnInit();
    component.showBackButton = false;
    mockRouter.events.next(new NavigationEnd(1, '/start', '/holdings'));
    expect(component.showBackButton).toBeTrue();
  });
});
