import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TagSearchComponentComponent} from './tag-search-component.component';

describe('TagSearchComponentComponent', () => {
    let component: TagSearchComponentComponent;
    let fixture: ComponentFixture<TagSearchComponentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TagSearchComponentComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TagSearchComponentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
