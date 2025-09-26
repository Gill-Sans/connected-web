import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStatusSelectComponent } from './project-status-select.component';

describe('ProjectStatusSelectComponent', () => {
  let component: ProjectStatusSelectComponent;
  let fixture: ComponentFixture<ProjectStatusSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectStatusSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectStatusSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
