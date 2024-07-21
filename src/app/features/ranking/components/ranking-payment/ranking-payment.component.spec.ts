import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingPaymentComponent } from './ranking-payment.component';

describe('RankingPaymentComponent', () => {
  let component: RankingPaymentComponent;
  let fixture: ComponentFixture<RankingPaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RankingPaymentComponent]
    });
    fixture = TestBed.createComponent(RankingPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
