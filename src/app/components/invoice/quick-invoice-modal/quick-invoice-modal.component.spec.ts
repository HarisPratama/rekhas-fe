import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickInvoiceModalComponent } from './quick-invoice-modal.component';

describe('QuickInvoiceModalComponent', () => {
  let component: QuickInvoiceModalComponent;
  let fixture: ComponentFixture<QuickInvoiceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickInvoiceModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickInvoiceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
