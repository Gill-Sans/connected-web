import {Component, inject, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from '../../../shared/components/button/button.component';
import {AuthFacade} from '../../../auth/store/auth.facade';

@Component({
    selector: 'app-verify-token',
    imports: [
        CommonModule,
        ButtonComponent
    ],
    templateUrl: './verify-token.component.html',
    styleUrl: './verify-token.component.scss'
})
export class VerifyTokenComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly http = inject(HttpClient);
    private readonly authFacade = inject(AuthFacade);

    isLoading: boolean = true;
    isError: boolean = false;
    message: string | null = null;
    showLoginButton: boolean = false;

    ngOnInit(): void {
        const token = this.route.snapshot.queryParamMap.get('token');
        if (token) {
            this.http.get(`${environment.apiBaseUrl}/api/users/verify?token=${token}`, { withCredentials: true })
                .subscribe({
                    next: () => {
                        this.isLoading = false;
                        this.isError = false;
                        this.message = 'Your email has been successfully verified. You can now proceed to the platform.';
                        this.showLoginButton = true;
                    },
                    error: (err) => {
                        this.isLoading = false;
                        this.isError = true;
                        this.message = err.error?.message || 'Invalid or expired token. Please try again.';
                    }
                });
        } else {
            this.isLoading = false;
            this.isError = true;
            this.message = 'No verification token found.';
        }
    }

    goToPlatform() {
        // ✅ Reload session so updated verification & role are reflected
        this.authFacade.loadSession().then(() => {
            void this.router.navigate(['/']);
        });
    }
}
