import {Component, inject, OnDestroy, OnInit} from '@angular/core';

import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthFacade } from '../../store/auth.facade';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import {Subscription} from 'rxjs';
import {ICONS} from '../../../shared/constants/icons';

@Component({
    selector: 'app-password-login',
    standalone: true,
    imports: [ReactiveFormsModule, ButtonComponent],
    templateUrl: './password-login.component.html',
    styleUrls: ['./password-login.component.scss']
})
export class PasswordLoginComponent implements OnInit, OnDestroy {
    private readonly authFacade = inject(AuthFacade);

    loginForm: FormGroup = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required])
    });

    errorMessage: string = '';

    subscriptions: Subscription[] = [];

    ngOnInit(): void {
        this.subscriptions.push(this.loginForm.valueChanges.subscribe(() => {
            if (this.errorMessage) {
                this.errorMessage = '';
            }
        }));
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            const { email, password } = this.loginForm.value;
            this.authFacade.login(email, password);
        } else {
            this.errorMessage = 'Please fill out all required fields correctly.';
            this.loginForm.markAllAsTouched();
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    navigateBack(): void {
        this.authFacade.redirectToLogin();
    }

    protected readonly icons = ICONS;
}
