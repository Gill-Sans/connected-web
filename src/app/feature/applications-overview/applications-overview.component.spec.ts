import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationsOverviewComponent } from './applications-overview.component';

describe('ApplicationsOverviewComponent', () => {
  let component: ApplicationsOverviewComponent;
  let fixture: ComponentFixture<ApplicationsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationsOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
