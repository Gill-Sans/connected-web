import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagcardComponent } from './tagcard.component';

describe('TagcardComponent', () => {
  let component: TagcardComponent;
  let fixture: ComponentFixture<TagcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagcardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
