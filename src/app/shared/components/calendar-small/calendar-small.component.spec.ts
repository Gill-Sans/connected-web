import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarSmallComponent } from './calendar-small.component';

describe('CalendarSmallComponent', () => {
  let component: CalendarSmallComponent;
  let fixture: ComponentFixture<CalendarSmallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarSmallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
