import {Component, inject, OnInit} from '@angular/core';
import {AuthFacade} from '../../store/auth.facade';
import {RegistrationRequest} from '../../models/registration-request.model';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-register',
  imports: [
      CommonModule,
      FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
    email: string = '';
    password: string  = '';
    firstName: string  = '';
    lastName: string  = '';
    invitationCode: string = '';
    errorMessage: string  = '';

    private readonly authFacade: AuthFacade = inject(AuthFacade);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly router: Router = inject(Router);


    ngOnInit(): void {
        const code = this.route.snapshot.queryParamMap.get('invitation-code');
        if (!code) {
            this.router.navigate(['/login']);
        } else {
            this.invitationCode = code;
        }
    }

    onSubmit(): void {
        const request: RegistrationRequest = {
            email: this.email,
            password: this.password,
            firstName: this.firstName,
            lastName: this.lastName,
            invitationCode: this.invitationCode
        };
        this.authFacade.register(request);
    }
}
