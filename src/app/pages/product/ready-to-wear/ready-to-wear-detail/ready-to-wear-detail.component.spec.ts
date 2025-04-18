import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyToWearDetailComponent } from './ready-to-wear-detail.component';

describe('ReadyToWearDetailComponent', () => {
  let component: ReadyToWearDetailComponent;
  let fixture: ComponentFixture<ReadyToWearDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadyToWearDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadyToWearDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
