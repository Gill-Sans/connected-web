import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {Role} from '../../auth/models/role.model';
import {HasRoleDirective} from '../../shared/directives/HasRole.directive';


@Component({
    selector: 'app-sidenav',
    imports: [
        RouterLink,
        RouterLinkActive,
        HasRoleDirective
    ],
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {
    public Role = Role;
}
