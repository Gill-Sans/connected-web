import {Component, inject, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthFacade} from '../../store/auth.facade';
import {ButtonComponent} from '../../../shared/components/button/button.component';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

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
    readonly router = inject(Router);

    // Bind dit aan de checkbox
    accepted: boolean = false;
    error: string = '';

    loginWithCanvas(): void {
        if (!this.accepted) {
            this.error = "Please read the data guides carefully and check this box before continuing authentication.";
            return;
        }
        // Clear error and proceed
        this.error = "";
        this.authFacade.redirectToCanvasLogin();
    }

    onCheckboxChange(value: boolean): void {
        if (value) {
            this.error = "";
        }
    }
}
