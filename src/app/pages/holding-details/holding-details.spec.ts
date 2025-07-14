import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HoldingDetails } from './holding-details';
import { HoldingService } from '../../services/holding-service';
import { Auth } from '../../services/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from '../../../shared/material-module';

class MockHoldingService {
  fetchHoldings(category: string) {
    return of([{ marketValue: '100' }, { marketValue: '200' }]);
  }
}
class MockAuth {
  getUser() { return 'testuser'; }
  logout() {}
}
class MockRouter {
  navigate(path: string[]) {}
}

describe('HoldingDetails', () => {
  let component: HoldingDetails;
  let fixture: ComponentFixture<HoldingDetails>;
  let holdingService: HoldingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HoldingDetails],
      imports: [HttpClientTestingModule,MaterialModule],
      providers: [
        { provide: HoldingService, useClass: MockHoldingService },
        { provide: Auth, useClass: MockAuth },
        { provide: Router, useClass: MockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: (key: string) => 'Equity' })
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldingDetails);
    component = fixture.componentInstance;
    holdingService = TestBed.inject(HoldingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
it('should fetch holdings on init', fakeAsync(() => {
  component.ngOnInit();
  tick();
  expect(component.holdings.length).toBe(2);
}));


  it('should calculate total value', () => {
    component.holdings = [{ marketValue: '100' }, { marketValue: '200' }];
    expect(component.getTotalValue()).toBe(300);
  });

it('should handle error from holdingService', fakeAsync(() => {
  spyOn(holdingService, 'fetchHoldings').and.returnValue(throwError(() => new Error('fail')));
  component.getHoldings('Equity');
  tick();
  expect(component.error).toBe('Failed to load holdings');
  expect(component.loading).toBeFalse();
}));


  it('should logout and navigate', () => {
    const auth = TestBed.inject(Auth);
    const router = TestBed.inject(Router);
    spyOn(auth, 'logout');
    spyOn(router, 'navigate');
    component.logout();
    expect(auth.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
