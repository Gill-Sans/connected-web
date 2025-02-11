import { Component, inject, Input } from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthFacade} from '../store/auth.facade';
import {ButtonComponent} from '../../shared/components/button/button.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ButtonComponent,
    FormsModule,

  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true
})
export class LoginComponent {
  @Input() isLoginVisible = true;
  private readonly authFacade = inject(AuthFacade);

  loginWithCanvas(): void {
    // Dispatch the action to redirect to the OAuth2 authorization endpoint.
    this.authFacade.redirectToCanvasLogin();
  }
}
