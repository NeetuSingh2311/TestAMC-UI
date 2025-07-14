import { TestBed } from '@angular/core/testing';
import { HoldingService } from './holding-service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Holding } from '../../shared/Holding';

describe('HoldingService', () => {
  let service: HoldingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HoldingService]
    });
    service = TestBed.inject(HoldingService);
    httpMock = TestBed.inject(HttpTestingController);
    sessionStorage.clear();
    sessionStorage.setItem('authUserEmail', 'user@example.com');
    sessionStorage.setItem('authPass', 'password123');
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch holdings for user role', () => {
    sessionStorage.setItem('userRole', 'USER');
    sessionStorage.setItem('authUserEmail', 'user@example.com');
    const mockHoldings: Holding[] = [{}, {}] as any;

    service.fetchHoldings('Equity').subscribe(data => {
      expect(data).toEqual(mockHoldings);
    });

    const req = httpMock.expectOne(
      req => req.url === 'http://localhost:8080/api/holding' &&
             req.params.get('email') === 'user@example.com' &&
             req.params.get('category') === 'Equity'
    );
    expect(req.request.method).toBe('GET');
    const expectedAuth = btoa('user@example.com:password123');
    expect(req.request.headers.get('Authorization')).toBe(`Basic ${expectedAuth}`);
    req.flush(mockHoldings);
  });

  it('should fetch holdings for ADMIN role using rowEmail', () => {
    sessionStorage.setItem('userRole', 'ADMIN');
    sessionStorage.setItem('rowEmail', 'adminuser@example.com');
    const mockHoldings: Holding[] = [{}, {}] as any;

    service.fetchHoldings('Fixed Income').subscribe(data => {
      expect(data).toEqual(mockHoldings);
    });

    const req = httpMock.expectOne(
      req => req.url === 'http://localhost:8080/api/holding' &&
             req.params.get('email') === 'adminuser@example.com' &&
             req.params.get('category') === 'Fixed Income'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockHoldings);
  });

  it('getEquity should call fetchHoldings with Equity', () => {
    spyOn(service, 'fetchHoldings').and.returnValue({ subscribe: () => {} } as any);
    service.getEquity('user@example.com');
    expect(service.fetchHoldings).toHaveBeenCalledWith('Equity');
  });

  it('getFixedIncome should call fetchHoldings with Fixed Income', () => {
    spyOn(service, 'fetchHoldings').and.returnValue({ subscribe: () => {} } as any);
    service.getFixedIncome('user@example.com');
    expect(service.fetchHoldings).toHaveBeenCalledWith('Fixed Income');
  });
});
