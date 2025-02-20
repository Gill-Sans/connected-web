import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeadlineCreateComponent } from './deadline-create.component';

describe('DeadlineCreateComponent', () => {
  let component: DeadlineCreateComponent;
  let fixture: ComponentFixture<DeadlineCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeadlineCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeadlineCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
