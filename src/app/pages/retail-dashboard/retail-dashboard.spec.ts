import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailDashboard } from './retail-dashboard';

describe('RetailDashboard', () => {
  let component: RetailDashboard;
  let fixture: ComponentFixture<RetailDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RetailDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetailDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
