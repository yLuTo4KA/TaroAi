import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBlockComponent } from './product-block.component';

describe('ProductBlockComponent', () => {
  let component: ProductBlockComponent;
  let fixture: ComponentFixture<ProductBlockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductBlockComponent]
    });
    fixture = TestBed.createComponent(ProductBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
