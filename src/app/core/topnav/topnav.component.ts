import {AuthFacade} from '../../auth/store/auth.facade';
import {CommonModule} from '@angular/common';
import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {Role} from '../../auth/models/role.model';
import {ClickOutsideDirective} from '../../shared/directives/click-outside.directive';
import {Observable} from 'rxjs';
import {User} from '../../auth/models/user.model';
import {CourseService} from '../services/course.service';
import {Course} from '../../shared/models/course.model';
import {ActiveAssignment, ActiveAssignmentService} from '../services/active-assignment.service';
import {Assignment} from '../../shared/models/assignment.model';

@Component({
    selector: 'app-topnav',
    imports: [
        CommonModule,
        ClickOutsideDirective
    ],
    templateUrl: './topnav.component.html',
    styleUrl: './topnav.component.scss'
})
export class TopnavComponent {
    public Role: typeof Role = Role;
    isHiddenAssignments: boolean = true;
    isHiddenProfile: boolean = true;

    private readonly authFacade: AuthFacade = inject(AuthFacade);
    readonly user$: Observable<User | null> = this.authFacade.user$;
    private readonly router: Router = inject(Router);
    private readonly courseService: CourseService = inject(CourseService);
    courses$: Observable<Course[] | null> = this.courseService.getAllCourses();
    private readonly activeAssignmentService: ActiveAssignmentService = inject(ActiveAssignmentService);
    public activeAssignment$: Observable<ActiveAssignment | null> = this.activeAssignmentService.activeAssignment$;

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
        this.activeAssignmentService.setActiveAssignment({assignment, course});
        this.isHiddenAssignments = true;
    }
}
