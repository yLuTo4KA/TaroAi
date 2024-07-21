import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSelectButtonComponent } from './payment-select-button.component';

describe('PaymentSelectButtonComponent', () => {
  let component: PaymentSelectButtonComponent;
  let fixture: ComponentFixture<PaymentSelectButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentSelectButtonComponent]
    });
    fixture = TestBed.createComponent(PaymentSelectButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
