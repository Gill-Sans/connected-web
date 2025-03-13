import {inject, Injectable} from '@angular/core';
import { ActiveAssignmentService } from './active-assignment.service';
import { ActiveAssignment } from '../../shared/models/activeAssignment.model';
import {AuthorizationService} from './authorization.service';

@Injectable({
    providedIn: 'root'
})
export class ActiveAssignmentRoutingService {
    private readonly activeAssignmentService: ActiveAssignmentService = inject(ActiveAssignmentService);
    private readonly authorizationService: AuthorizationService = inject(AuthorizationService);
    private readonly isResearcher$ = this.authorizationService.isResearcher$();

    // Converts a given string into a URL-friendly slug.
    slugify(text: string): string {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/[\s\W-]+/g, '-');
    }

    getActiveAssignmentRouteSegment(): string[] {
        const active: ActiveAssignment | null = this.activeAssignmentService.getActiveAssignment();
        if (active) {
            const courseSlug = this.slugify(active.course.name);
            const assignmentSlug = this.slugify(active.assignment.name);
            return ["course", courseSlug, "assignment", assignmentSlug];
        }
        // Return empty or default values if no active assignment is set.
        return [];
    }

    buildRoute(...segments: string[]): string[] {
        let route: string[] = [];
        this.isResearcher$.subscribe(isResearcher => {
            if (isResearcher) {
                route = segments;
            } else {
                route = [...this.getActiveAssignmentRouteSegment(), ...segments];
            }
        }).unsubscribe();
        return route;
    }
}
