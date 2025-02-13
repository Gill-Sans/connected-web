import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { ActiveAssignment } from '../../shared/models/activeAssignment.model';
import { ActiveAssignmentService } from './active-assignment.service';
import { CourseService } from './course.service';

@Injectable({
    providedIn: 'root'
})
export class ActiveAssignmentResolver implements Resolve<ActiveAssignment> {
    constructor(
        private activeAssignmentService: ActiveAssignmentService,
        private courseService: CourseService,
        private router: Router
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<ActiveAssignment> {
        const courseSlug = route.paramMap.get('courseSlug');
        const assignmentSlug = route.paramMap.get('assignmentSlug');

        if (!courseSlug || !assignmentSlug) {
            this.router.navigate(['/404']);
            return EMPTY;
        }

        return this.courseService.getAllEnrolledCourses().pipe(
            mergeMap(courses => {
                // Find course based on slug
                const course = courses.find(c => this.slugify(c.name) === courseSlug);
                if (!course) {
                    console.error(`Course not found for slug: ${courseSlug}`);
                    this.router.navigate(['/404']);
                    return EMPTY;
                }
                // Check for assignments in the course
                if (!course.assignments || course.assignments.length === 0) {
                    console.error(`No assignments found for course: ${course.name}`);
                    this.router.navigate(['/404']);
                    return EMPTY;
                }
                // Find the assignment based on slug
                const assignment = course.assignments.find(a => this.slugify(a.name) === assignmentSlug);
                if (!assignment) {
                    console.error(`Assignment not found for slug: ${assignmentSlug} in course: ${course.name}`);
                    this.router.navigate(['/404']);
                    return EMPTY;
                }
                // Build the active assignment
                const activeAssignment: ActiveAssignment = { course, assignment };
                // Set the active assignment so components can access it
                this.activeAssignmentService.setActiveAssignment(activeAssignment);
                return of(activeAssignment);
            }),
            catchError(error => {
                console.error('Error resolving active assignment', error);
                this.router.navigate(['/404']);
                return EMPTY;
            })
        );
    }

    // Helper method to create a URL-friendly slug.
    private slugify(text: string): string {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/[\s\W-]+/g, '-');
    }
}
