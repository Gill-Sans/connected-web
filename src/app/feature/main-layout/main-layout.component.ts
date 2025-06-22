import {Component, inject, OnInit} from '@angular/core';
import {SidenavComponent} from '../../core/sidenav/sidenav.component';
import {TopnavComponent} from '../../core/topnav/topnav.component';
import {RouterOutlet} from '@angular/router';
import {ButtonComponent} from "../../shared/components/button/button.component";
import {NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserService} from '../../core/services/user.service';

@Component({
    selector: 'app-main-layout',
    imports: [
        RouterOutlet,
        SidenavComponent,
        TopnavComponent,
        ButtonComponent,
        NgIf,
        ReactiveFormsModule,
        FormsModule
    ],
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit {
    private userService= inject(UserService)

    showEmailDialog = false;
    emailToVerify = '';
    emailVerificationMessage = '';
    isVerifying = false;
    emailVerified = false;

    ngOnInit(): void {
        this.userService.getCurrentUser().subscribe({
            next: (user) => {
                this.showEmailDialog = false;
            },
            error: () => {
                this.showEmailDialog = true;
            }
        });
    }

    sendVerificationEmail(): void {
        this.isVerifying = true;
        this.emailVerificationMessage = '';
        this.userService.sendVerificationEmail(this.emailToVerify).subscribe({
            next: () => {
                this.emailVerificationMessage = 'Verification email sent. Please check your inbox.';
                this.isVerifying = false;
            },
            error: () => {
                this.emailVerificationMessage = 'Failed to send verification email.';
                this.isVerifying = false;
            }
        });
    }

    closeEmailDialog(): void {
        this.showEmailDialog = false;
    }

    checkEmailVerified(): void {
        this.userService.checkEmailVerified(this.emailToVerify).subscribe({
            next: (verified: boolean) => {
                this.emailVerified = verified;
                if (verified) {
                    this.showEmailDialog = false;
                } else {
                    this.emailVerificationMessage = 'Email not verified yet.';
                }
            },
            error: () => {
                this.emailVerificationMessage = 'Error checking verification status.';
            }
        });
    }



}
