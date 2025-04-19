import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDetailModalComponent } from './payment-detail-modal.component';

describe('PaymentDetailModalComponent', () => {
  let component: PaymentDetailModalComponent;
  let fixture: ComponentFixture<PaymentDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentDetailModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
