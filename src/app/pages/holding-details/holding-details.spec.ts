import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldingDetails } from './holding-details';

describe('HoldingDetails', () => {
  let component: HoldingDetails;
  let fixture: ComponentFixture<HoldingDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HoldingDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoldingDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
