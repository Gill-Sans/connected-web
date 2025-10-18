import { Component, OnInit, inject } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AuthFacade } from '../../store/auth.facade';
import { RegistrationRequest } from '../../models/registration-request.model';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, ButtonComponent],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    private readonly authFacade: AuthFacade = inject(AuthFacade);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly router: Router = inject(Router);

    // Build the reactive form with validators.
    registerForm: FormGroup = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
            Validators.required,
            // Password must contain at least 8 characters, one uppercase letter, one number, and one special character.
            Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        ]),
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required])
    });

    invitationCode: string = '';
    errorMessage: string = '';

    ngOnInit(): void {
        const code = this.route.snapshot.queryParamMap.get('invitation-code');
        if (!code) {
            this.router.navigate(['/login']);
        } else {
            this.invitationCode = code;
        }
    }

    onSubmit(): void {
        if (this.registerForm.valid) {
            const request: RegistrationRequest = {
                email: this.registerForm.value.email,
                password: this.registerForm.value.password,
                firstName: this.registerForm.value.firstName,
                lastName: this.registerForm.value.lastName,
                invitationCode: this.invitationCode
            };
            this.authFacade.register(request);
        } else {
            this.registerForm.markAllAsTouched();
            this.errorMessage = 'Please fill out all required fields correctly.';
        }
    }
}
