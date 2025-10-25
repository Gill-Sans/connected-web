import {Injectable, PLATFORM_ID, computed, inject, signal, Signal} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {toSignal} from '@angular/core/rxjs-interop';

@Injectable({
    providedIn: 'root'
})
export class DeviceService {
    private readonly breakpointObserver = inject(BreakpointObserver);
    private readonly platformId = inject(PLATFORM_ID);

    private readonly handsetMatchSignal: Signal<boolean>;
    readonly isMobile: Signal<boolean>;

    constructor() {
        const initialValue = false;
        if (isPlatformBrowser(this.platformId)) {
            this.handsetMatchSignal = toSignal(
                this.breakpointObserver.observe([
                    Breakpoints.HandsetPortrait,
                    Breakpoints.HandsetLandscape,
                    '(max-width: 767px)'
                ]).pipe(map(result => result.matches)),
                {initialValue}
            );
        } else {
            this.handsetMatchSignal = signal(initialValue);
        }

        this.isMobile = computed(() => this.handsetMatchSignal());
    }
}
