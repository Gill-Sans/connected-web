import {Component, inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthFacade } from './auth/store/auth.facade';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from './shared/components/toast/toast.component';
import {debounceTime, fromEvent, Subscription} from 'rxjs';
import {BugReportComponent} from './core/bug-report/bug-report.component';
import {MobileUnsupportedComponent} from './shared/components/mobile-unsupported/mobile-unsupported.component';


@Component({
    selector: 'app-root',
    imports: [
        CommonModule,
        RouterOutlet,
        FormsModule,
        ToastComponent,
        BugReportComponent,
        MobileUnsupportedComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'ConnectEd';

    private readonly authFacade = inject(AuthFacade);
    readonly isLoading$ = this.authFacade.isLoading$;
    readonly platformId = inject(PLATFORM_ID);

    private subscriptions: Subscription[] = [];
    isMobile: boolean = false;

    ngOnInit(): void {
        this.authFacade.loadSession().then(() => {
            if (isPlatformBrowser(this.platformId)) {
                this.checkIfMobile();

                const resizeSub = fromEvent(window, 'resize')
                    .pipe(debounceTime(200))
                    .subscribe(() => this.checkIfMobile());

                this.subscriptions.push(resizeSub);

                const splash = document.getElementById('splash-screen');
                if (splash) splash.remove();
            }
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    private checkIfMobile(): void {
        const userAgent: string = navigator.userAgent;
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        const isMobile: boolean = mobileRegex.test(userAgent);
        const isSmallScreen: boolean = window.innerWidth < 768;
        this.isMobile = isMobile || isSmallScreen;
    }
}
