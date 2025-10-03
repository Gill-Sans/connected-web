import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileUnsupportedComponent } from './mobile-unsupported.component';

describe('MobileUnsupportedComponent', () => {
  let component: MobileUnsupportedComponent;
  let fixture: ComponentFixture<MobileUnsupportedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileUnsupportedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileUnsupportedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
