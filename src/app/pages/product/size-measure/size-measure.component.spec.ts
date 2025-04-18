import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SizeMeasureComponent } from './size-measure.component';

describe('SizeMeasureComponent', () => {
  let component: SizeMeasureComponent;
  let fixture: ComponentFixture<SizeMeasureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SizeMeasureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SizeMeasureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
