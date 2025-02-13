import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ActiveAssignment } from '../../shared/models/activeAssignment.model';
import { ActiveAssignmentService } from './active-assignment.service';
import { CourseService } from './course.service';

@Injectable({
    providedIn: 'root'
})
export class ActiveAssignmentResolver implements Resolve<ActiveAssignment | null> {

    constructor(
        private activeAssignmentService: ActiveAssignmentService,
        private courseService: CourseService
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<ActiveAssignment | null> {
        const courseSlug = route.paramMap.get('courseSlug');
        const assignmentSlug = route.paramMap.get('assignmentSlug');

        if (!courseSlug || !assignmentSlug) {
            return of(null);
        }

        // Fetch the enrolled courses and attempt to locate the correct course and assignment.
        return this.courseService.getAllEnrolledCourses().pipe(
            map((courses) => {
                // Find the course with a matching slug
                const course = courses.find(c => this.slugify(c.name) === courseSlug);
                if (!course) {
                    console.error(`Course not found for slug: ${courseSlug}`);
                    return null;
                }
                // Ensure the course has assignments (assuming it does)
                if (!course.assignments || course.assignments.length === 0) {
                    console.error(`No assignments found for course: ${course.name}`);
                    return null;
                }
                // Find the assignment with a matching slug
                const assignment = course.assignments.find(a => this.slugify(a.name) === assignmentSlug);
                if (!assignment) {
                    console.error(`Assignment not found for slug: ${assignmentSlug} in course: ${course.name}`);
                    return null;
                }
                const activeAssignment: ActiveAssignment = { course, assignment };
                // Set the active assignment in the service for use in your components
                this.activeAssignmentService.setActiveAssignment(activeAssignment);
                return activeAssignment;
            }),
            catchError(error => {
                console.error('Error resolving active assignment', error);
                return of(null);
            })
        );
    }

    // Helper method to convert a string into a URL-friendly slug.
    private slugify(text: string): string {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/[\s\W-]+/g, '-');
    }
}
