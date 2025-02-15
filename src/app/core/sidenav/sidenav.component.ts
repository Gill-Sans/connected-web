import { Component, inject } from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import { Role } from '../../auth/models/role.model';
import { HasRoleDirective } from '../../shared/directives/HasRole.directive';
import {ActiveAssignmentRoutingService} from '../services/active-assignment-routing.service';

@Component({
    selector: 'app-sidenav',
    imports: [
        HasRoleDirective,
        RouterModule
    ],
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {
    public Role: typeof Role = Role;
    private assignmentRoutingService:ActiveAssignmentRoutingService = inject(ActiveAssignmentRoutingService);

    // List of routes that should NOT include the active assignment context
    private excludedRoutes: string[] = ['courses', 'profile'];

    /**
     * Returns the proper router link for the given route.
     * If the route should include the active assignment context, it builds that.
     */
    getRoute(route: string | string[]): string[] {
        let segments: string[];
        if (typeof route === 'string') {
            segments = [route];
        } else {
            segments = route;
        }
        if (this.excludedRoutes.includes(segments[0])) {
            return segments;
        } else {
            return this.assignmentRoutingService.buildRoute(...segments);
        }
    }
}
