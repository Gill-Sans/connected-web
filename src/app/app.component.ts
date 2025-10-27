import {Component, inject, OnInit, PLATFORM_ID} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {AuthFacade} from './auth/store/auth.facade';
import {FormsModule} from '@angular/forms';
import {ToastComponent} from './shared/components/toast/toast.component';
import {BugReportComponent} from './core/bug-report/bug-report.component';
import {DeviceService} from './shared/services/device/device.service';


@Component({
    selector: 'app-root',
    imports: [
        CommonModule,
        RouterOutlet,
        FormsModule,
        ToastComponent,
        BugReportComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    title = 'ConnectEd';

    private readonly authFacade = inject(AuthFacade);
    readonly isLoading$ = this.authFacade.isLoading$;
    readonly platformId = inject(PLATFORM_ID);
    private readonly deviceService = inject(DeviceService);

    readonly isMobile = this.deviceService.isMobile;

    ngOnInit(): void {
        this.authFacade.loadSession().then(() => {
            if (isPlatformBrowser(this.platformId)) {
                const splash = document.getElementById('splash-screen');
                if (splash) splash.remove();
            }
        });
    }
}
