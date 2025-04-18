import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopDetailModalComponent } from './workshop-detail-modal.component';

describe('WorkshopDetailModalComponent', () => {
  let component: WorkshopDetailModalComponent;
  let fixture: ComponentFixture<WorkshopDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkshopDetailModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkshopDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
