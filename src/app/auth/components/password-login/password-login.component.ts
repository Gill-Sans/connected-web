import {Component, inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {AuthFacade} from '../../store/auth.facade';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-password-login',
  imports: [
      CommonModule,
      FormsModule
  ],
  templateUrl: './password-login.component.html',
  styleUrl: './password-login.component.scss'
})
export class PasswordLoginComponent {
    email = '';
    password = '';
    errorMessage = '';
    private readonly authFacade = inject(AuthFacade);
    private readonly store = inject(Store);

    onSubmit(): void {
        // Use the facade to dispatch the login action.
        this.authFacade.login(this.email, this.password);
    }
}
