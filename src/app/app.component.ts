import {Component, inject, OnInit, PLATFORM_ID} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {AuthFacade} from './auth/store/auth.facade';
import {FormsModule} from '@angular/forms';


@Component({
    selector: 'app-root',
    imports: [
        CommonModule,
        RouterOutlet,
        FormsModule
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    title = 'connected-web';

    private readonly authFacade = inject(AuthFacade);
    readonly isLoading$ = this.authFacade.isLoading$;
    readonly platformId = inject(PLATFORM_ID);

    ngOnInit(): void {
        this.authFacade.loadSession().then(() => {
            // Only access document if running in the browser
            if (isPlatformBrowser(this.platformId)) {
                const splash = document.getElementById('splash-screen');
                if (splash) {
                    splash.remove();
                }
            }
        });
    }
}
