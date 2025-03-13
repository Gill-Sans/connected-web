import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ButtonComponent} from '../../shared/components/button/button.component';

@Component({
    selector: 'app-auth-layout',
    imports: [
        RouterOutlet,
        ButtonComponent
    ],
    templateUrl: './auth-layout.component.html',
    styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {

}
