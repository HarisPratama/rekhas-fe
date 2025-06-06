import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckpointComponent } from './checkpoint.component';

describe('CheckpointComponent', () => {
  let component: CheckpointComponent;
  let fixture: ComponentFixture<CheckpointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckpointComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
