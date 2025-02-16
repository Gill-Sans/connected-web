import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ConversationcardComponent} from './conversationcard.component';

describe('ConversationcardComponent', () => {
    let component: ConversationcardComponent;
    let fixture: ComponentFixture<ConversationcardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConversationcardComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ConversationcardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
