import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkcardComponent } from './linkcard.component';

describe('LinkcardComponent', () => {
  let component: LinkcardComponent;
  let fixture: ComponentFixture<LinkcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkcardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
