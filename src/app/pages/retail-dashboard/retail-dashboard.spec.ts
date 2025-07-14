import { ComponentFixture } from "@angular/core/testing";
import { RetailDashboard } from "./retail-dashboard";
import { of, throwError } from "rxjs";
import { TestBed, fakeAsync } from "@angular/core/testing";
import { PortfolioService } from "../../services/portfolio-service";
import { Holding } from "../../../shared/Holding";
import { HoldingService } from "../../services/holding-service";
import { Auth } from "../../services/auth";
import { ActivatedRoute, Router } from "@angular/router";
import { MaterialModule } from "../../../shared/material-module";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe('RetailDashboard', () => {
  let component: RetailDashboard;
  let fixture: ComponentFixture<RetailDashboard>;
  let mockPortfolioService: any;
  let mockHoldingService: any;
  let mockAuth: any;
  let mockRouter: any;
  let mockActivatedRoute: any = {
    snapshot: {
      params: {}
    }
  };

  beforeEach(async () => {
    mockPortfolioService = {
      getOwnPortfolio: jasmine.createSpy().and.returnValue(of({
        totalMarketValue: 1000,
        categories: [
          { categoryName: 'Equity', marketValue: 600 },
          { categoryName: 'Fixed Income', marketValue: 400 }
        ]
      }))
    };

    mockHoldingService = {
      getEquity: jasmine.createSpy().and.returnValue(of([
        { marketValue: '300' }, { marketValue: '200' }
      ] as Holding[])),
      getFixedIncome: jasmine.createSpy().and.returnValue(of([
        { marketValue: '250' }, { marketValue: '150' }
      ] as Holding[]))
    };

    mockAuth = {
      getUser: jasmine.createSpy().and.returnValue('Test User'),
      getUserRole: jasmine.createSpy().and.returnValue('USER'),
      getEmail: jasmine.createSpy().and.returnValue('test@example.com')
    };

    mockRouter = {
      navigate: jasmine.createSpy()
    };

    await TestBed.configureTestingModule({
      declarations: [RetailDashboard],
      providers: [
        { provide: PortfolioService, useValue: mockPortfolioService },
        { provide: HoldingService, useValue: mockHoldingService },
        { provide: Auth, useValue: mockAuth },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute,useValue:mockActivatedRoute }

      ],
      imports: [MaterialModule,HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(RetailDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize userName, email, and call data loaders on ngOnInit', () => {
    expect(component.userName).toBe('Test User');
    expect(component.email).toBe('test@example.com');
    expect(mockPortfolioService.getOwnPortfolio).toHaveBeenCalled();
    expect(mockHoldingService.getEquity).toHaveBeenCalled();
    expect(mockHoldingService.getFixedIncome).toHaveBeenCalled();
  });

  it('should set equityTotal and fixedTotal from portfolio data', () => {
    expect(component.equityTotal).toBe(600);
    expect(component.fixedTotal).toBe(400);
    expect(component.totalMarket).toBe(1000);
  });

  it('should calculate equity and fixed income percentages', () => {
    expect(component.getEquityPercentage()).toBeCloseTo(60);
    expect(component.getFixedIncomePercentage()).toBeCloseTo(40);
  });

  it('should return total holdings', () => {
    expect(component.getTotalHoldings()).toBe(4);
  });

  it('should return top equity holdings', () => {
    const top = component.getTopEquityHoldings();
    expect(top.length).toBe(2);
    expect(parseFloat(top[0].marketValue)).toBeGreaterThanOrEqual(parseFloat(top[1].marketValue));
  });

  it('should return top fixed income holdings', () => {
    const top = component.getTopFixedIncomeHoldings();
    expect(top.length).toBe(2);
    expect(parseFloat(top[0].marketValue)).toBeGreaterThanOrEqual(parseFloat(top[1].marketValue));
  });

  it('should navigate to holdings on onCardClick', fakeAsync(async () => {
    spyOn(component as any, 'hashEmail').and.returnValue(Promise.resolve('hashedEmail'));
    await component.onCardClick('Equity');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/holdings', 'Equity', 'hashedEmail']);
  }));

  it('should handle error in portfolioService', () => {
    mockPortfolioService.getOwnPortfolio.and.returnValue(throwError(() => new Error('fail')));
    component['loadPortfolioData']();
    // Should not throw
  });

  it('should handle error in holdingService', () => {
    mockHoldingService.getEquity.and.returnValue(throwError(() => new Error('fail')));
    mockHoldingService.getFixedIncome.and.returnValue(throwError(() => new Error('fail')));
    component['loadHoldingsData']();
    // Should not throw
  });
});
