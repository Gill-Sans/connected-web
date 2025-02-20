import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasImportModalComponent } from './canvas-import-modal.component';

describe('CanvasImportModalComponent', () => {
  let component: CanvasImportModalComponent;
  let fixture: ComponentFixture<CanvasImportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanvasImportModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanvasImportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
