import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LayoutModule} from '@angular/cdk/layout';

import {MainLayoutComponent} from './main-layout.component';

describe('MainLayoutComponent', () => {
    let component: MainLayoutComponent;
    let fixture: ComponentFixture<MainLayoutComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MainLayoutComponent, LayoutModule]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MainLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
