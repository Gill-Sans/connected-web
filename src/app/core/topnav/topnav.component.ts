import {AuthFacade} from '../../auth/store/auth.facade';
import {CommonModule} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Role} from '../../auth/models/role.model';
import {ClickOutsideDirective} from '../../shared/directives/click-outside.directive';
import {Observable} from 'rxjs';
import {User} from '../../auth/models/user.model';
import {CourseService} from '../services/course.service';
import {Course} from '../../shared/models/course.model';
import {ActiveAssignmentService} from '../services/active-assignment.service';
import {Assignment} from '../../shared/models/assignment.model';
import { ActiveAssignment } from '../../shared/models/activeAssignment.model';
@Component({
    selector: 'app-topnav',
    imports: [
        CommonModule,
        ClickOutsideDirective
    ],
    templateUrl: './topnav.component.html',
    styleUrl: './topnav.component.scss'
})
export class TopnavComponent{
    private readonly authFacade: AuthFacade = inject(AuthFacade);
    private readonly router: Router = inject(Router);
    private readonly courseService: CourseService = inject(CourseService);
    private readonly activeAssignmentService: ActiveAssignmentService = inject(ActiveAssignmentService);

    public activeAssignment$: Observable<ActiveAssignment | null> = this.activeAssignmentService.activeAssignment$;
    public courses$: Observable<Course[] | null> = this.courseService.getAllEnrolledCourses();
    readonly user$: Observable<User | null> = this.authFacade.user$;

    public Role: typeof Role = Role;
    isHiddenAssignments: boolean = true;
    isHiddenProfile: boolean = true;
    toggleAssignmentsHidden() {
        this.isHiddenAssignments = !this.isHiddenAssignments;
    }

    closeAssignmentsDropdown() {
        this.isHiddenAssignments = true;
    }

    toggleHiddenprofile() {
        this.isHiddenProfile = !this.isHiddenProfile;
    }

    // This method is called when a click is detected outside the dropdown.
    closeProfileDropdown() {
        this.isHiddenProfile = true;
    }

    navigateToProfile() {
        this.router.navigate(['/profile']);
    }

    logout() {
        console.log('logout!');
    }

    selectAssignment(assignment: Assignment, course: Course): void {
        // Set the active assignment in the service
        this.activeAssignmentService.setActiveAssignment({ assignment, course });
        this.isHiddenAssignments = true;

        // Create URL-friendly slugs for the course and assignment names
        const courseSlug = this.slugify(course.name);
        const assignmentSlug = this.slugify(assignment.name);

        // Navigate to the default route under the active assignment context (e.g., 'projects')
        this.router.navigate(['/', courseSlug, assignmentSlug, '/']);
    }

    private slugify(text: string): string {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/[\s\W-]+/g, '-');  // Replace spaces and non-word characters with a dash
    }
}
