import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    imports: [
        CommonModule,
        FormsModule
    ],
})
export class SettingsComponent {
    private readonly http = inject(HttpClient);
    inviteLink: string = '';
    isLoading: boolean = false;
    errorMessage: string = '';

    generateInviteLink(): void {
        this.isLoading = true;
        this.errorMessage = '';
        this.http.post<{ code: string }>(`${environment.apiBaseUrl}/api/invitations/generate`, {}, { withCredentials: true }).subscribe({
            next: (response) => {
                console.log('Invitation code generated', response.code);
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
                console.log('Invitation link copied to clipboard');
            }).catch(err => {
                console.error('Failed to copy the link!', err);
            });
        }
    }
}
