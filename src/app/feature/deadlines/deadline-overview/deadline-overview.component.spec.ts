import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeadlineOverviewComponent } from './deadline-overview.component';

describe('DeadlineOverviewComponent', () => {
  let component: DeadlineOverviewComponent;
  let fixture: ComponentFixture<DeadlineOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeadlineOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeadlineOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
