import {inject, Injectable} from '@angular/core';
import { ActiveAssignmentService } from './active-assignment.service';
import { ActiveAssignment } from '../../shared/models/activeAssignment.model';

@Injectable({
    providedIn: 'root'
})
export class ActiveAssignmentRoutingService {
    private readonly activeAssignmentService: ActiveAssignmentService = inject(ActiveAssignmentService);

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
            return [courseSlug, assignmentSlug];
        }
        // Return empty or default values if no active assignment is set.
        return [];
    }

    buildRoute(...segments: string[]): string[] {
        return [...this.getActiveAssignmentRouteSegment(), ...segments];
    }
}
