import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailInvoiceTemplateComponent } from './detail-invoice-template.component';

describe('DetailInvoiceTemplateComponent', () => {
  let component: DetailInvoiceTemplateComponent;
  let fixture: ComponentFixture<DetailInvoiceTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailInvoiceTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailInvoiceTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
