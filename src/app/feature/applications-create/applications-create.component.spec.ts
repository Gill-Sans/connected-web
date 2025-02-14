import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationsCreateComponent } from './applications-create.component';

describe('ApplicationsCreateComponent', () => {
  let component: ApplicationsCreateComponent;
  let fixture: ComponentFixture<ApplicationsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationsCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
