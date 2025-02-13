import { Component, inject } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import { Role } from '../../auth/models/role.model';
import { HasRoleDirective } from '../../shared/directives/HasRole.directive';
import {ActiveAssignmentRoutingService} from '../services/active-assignment-routing.service';

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

    private router = inject(Router);
    private assignmentRoutingService = inject(ActiveAssignmentRoutingService);

    // List of routes that should NOT include the active assignment context
    private excludedRoutes = ['courses', 'profile'];

    /**
     * Navigates to a route.
     * @param route A string or an array of route segments.
     */
    navigateTo(route: string | string[]): void {
        let segments: string[];
        if (typeof route === 'string') {
            segments = [route];
        } else {
            segments = route;
        }

        let builtRoute: string[];
        // If the first segment is in the excludedRoutes, use it as is.
        if (this.excludedRoutes.includes(segments[0])) {
            builtRoute = segments;
        } else {
            // Append the active assignment context to the route.
            builtRoute = this.assignmentRoutingService.buildRoute(...segments);
        }
        this.router.navigate(builtRoute);
    }
}
