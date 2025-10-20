import {Component, inject} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import { NgOptimizedImage } from '@angular/common';
import {ButtonComponent} from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-verify-email',
    standalone: true,
    imports: [
    ReactiveFormsModule,
    ButtonComponent,
    NgOptimizedImage
],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent {
    private readonly fb = inject(FormBuilder);
    private readonly http = inject(HttpClient);

    verifyForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]]
    });
    submitted = false;
    isLoading = false;
    message: string | null = null;
    messageType: 'success' | 'error' = 'success';

    onSubmit() {
        this.submitted = true;
        this.message = null;

        if (this.verifyForm.invalid) {
            return;
        }

        this.isLoading = true;
        const email = this.verifyForm.value.email;
        this.http.post(`${environment.apiBaseUrl}/api/users/send-verification-email`, { email }, { withCredentials: true })
            .subscribe({
                next: () => {
                    this.isLoading = false;
                    this.messageType = 'success';
                    this.message = 'Verification email sent! Please check your inbox.';
                },
                error: (err) => {
                    this.isLoading = false;
                    this.messageType = 'error';
                    this.message = err.error?.message || 'An unexpected error occurred. Please try again.';
                }
            });
    }
}
