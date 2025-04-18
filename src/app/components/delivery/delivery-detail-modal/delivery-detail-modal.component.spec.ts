import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryDetailModalComponent } from './delivery-detail-modal.component';

describe('DeliveryDetailModalComponent', () => {
  let component: DeliveryDetailModalComponent;
  let fixture: ComponentFixture<DeliveryDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryDetailModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
