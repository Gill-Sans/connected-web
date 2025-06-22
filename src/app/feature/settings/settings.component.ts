import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ToastService} from '../../core/services/toast.service';
import {ButtonComponent} from '../../shared/components/button/button.component';
import {HasRoleDirective} from '../../shared/directives/HasRole.directive';
import {Role} from '../../auth/models/role.model';
import {ConfirmClickDirective} from '../../shared/directives/confirmClick.directive';
import {UserService} from '../../core/services/user.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        ButtonComponent,
        HasRoleDirective,
        ConfirmClickDirective
    ],
})
export class SettingsComponent {
    emailToVerify: string = '';
    emailVerificationMessage: string = '';
    private readonly http: HttpClient = inject(HttpClient);
    private readonly toastService: ToastService = inject(ToastService);
    protected readonly Role = Role;
    inviteLink: string = '';
    isLoading: boolean = false;
    errorMessage: string = '';

    constructor(
        private userService: UserService
    ) {}

    generateInviteLink(): void {
        this.isLoading = true;
        this.errorMessage = '';
        this.http.post<{ code: string }>(`${environment.apiBaseUrl}/api/invitations/generate`, {}, { withCredentials: true }).subscribe({
            next: (response) => {
                this.inviteLink = `${environment.baseUrl}/register?invitation-code=${response.code}`;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error generating invitation code', error);
                this.errorMessage = 'Error generating invitation link';
                this.isLoading = false;
            }
        });
    }

    copyInviteLink(): void {
        if (this.inviteLink) {
            navigator.clipboard.writeText(this.inviteLink).then(() => {
                this.toastService.showToast('info', 'Link copied to clipboard');
            }).catch(err => {
                console.error('Failed to copy the link!', err);
            });
        }
    }

    requestAccountDeletion(){
        this.isLoading = true;
        this.errorMessage = '';
        this.http.post(`${environment.apiBaseUrl}/api/users/request-delete`, {}, { withCredentials: true }).subscribe({
            next: () => {
                this.toastService.showToast('info', 'Account deletion requested');
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error requesting account deletion', error);
                this.errorMessage = 'Error requesting account deletion';
                this.isLoading = false;
            }
        });
    }

    verifyEmail(): void {
        this.isLoading = true;
        this.emailVerificationMessage = '';
        this.userService.sendVerificationEmail(this.emailToVerify).subscribe({
            next: () => {
                this.emailVerificationMessage = 'Verification email sent. Please check your inbox.';
                this.isLoading = false;
            },
            error: () => {
                this.emailVerificationMessage = 'Failed to send verification email.';
                this.isLoading = false;
            }
        });
    }
}
