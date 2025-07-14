import { TestBed } from '@angular/core/testing';
import { PortfolioService } from './portfolio-service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('PortfolioService', () => {
  let service: PortfolioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PortfolioService]
    });
    service = TestBed.inject(PortfolioService);
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

  it('should get own portfolio for non-ADMIN role', () => {
    sessionStorage.setItem('userRole', 'USER');
    const mockResponse = { summary: 'portfolio data' };

    service.getOwnPortfolio().subscribe(data => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/portfolio/summary');
    expect(req.request.method).toBe('GET');
    const expectedAuth = btoa('user@example.com:password123');
    expect(req.request.headers.get('Authorization')).toBe(`Basic ${expectedAuth}`);
    req.flush(mockResponse);
  });

  it('should get own portfolio for ADMIN role with rowEmail', () => {
    sessionStorage.setItem('userRole', 'ADMIN');
    sessionStorage.setItem('rowEmail', 'adminuser@example.com');
    const mockResponse = { summary: 'admin portfolio data' };

    service.getOwnPortfolio().subscribe(data => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/portfolio/summary?email=adminuser@example.com');
    expect(req.request.method).toBe('GET');
    const expectedAuth = btoa('user@example.com:password123');
    expect(req.request.headers.get('Authorization')).toBe(`Basic ${expectedAuth}`);
    req.flush(mockResponse);
  });
});
