import {Component, inject} from '@angular/core';
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

    onSubmit(): void {
        this.authFacade.login(this.email, this.password);
    }
}
