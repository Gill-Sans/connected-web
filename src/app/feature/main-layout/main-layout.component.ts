import {Component, OnDestroy, inject} from '@angular/core';
import {SidenavComponent} from '../../core/sidenav/sidenav.component';
import {TopnavComponent} from '../../core/topnav/topnav.component';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {DeviceService} from '../../shared/services/device/device.service';
import {DOCUMENT} from '@angular/common';
import {filter} from 'rxjs/operators';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-main-layout',
    imports: [
        RouterOutlet,
        SidenavComponent,
        TopnavComponent
    ],
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnDestroy {
    private readonly deviceService = inject(DeviceService);
    private readonly document = inject(DOCUMENT);
    private readonly router = inject(Router);

    readonly isMobile = this.deviceService.isMobile;

    mobileNavOpen = false;

    constructor() {
        this.router.events
            .pipe(
                filter((event): event is NavigationEnd => event instanceof NavigationEnd),
                takeUntilDestroyed()
            )
            .subscribe(() => this.closeMobileNav());
    }

    toggleMobileNav(): void {
        this.mobileNavOpen = !this.mobileNavOpen;
        this.setBodyScrollLock(this.mobileNavOpen);
    }

    closeMobileNav(): void {
        if (!this.mobileNavOpen) {
            return;
        }

        this.mobileNavOpen = false;
        this.setBodyScrollLock(false);
    }

    ngOnDestroy(): void {
        this.setBodyScrollLock(false);
    }

    private setBodyScrollLock(lock: boolean): void {
        const body = this.document?.body;

        if (!body) {
            return;
        }

        body.style.overflow = lock ? 'hidden' : '';
    }
}
