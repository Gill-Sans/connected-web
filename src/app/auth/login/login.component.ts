import { Component, inject, Input } from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthFacade} from '../store/auth.facade';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
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
