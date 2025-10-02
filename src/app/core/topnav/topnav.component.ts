import {AuthFacade} from '../../auth/store/auth.facade';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {ClickOutsideDirective} from '../../shared/directives/click-outside.directive';
import {Observable, Subscription} from 'rxjs';
import {User} from '../../auth/models/user.model';
import {CourseService} from '../services/course.service';
import {Course} from '../../shared/models/course.model';
import {ActiveAssignmentService} from '../services/active-assignment.service';
import {Assignment} from '../../shared/models/assignment.model';
import {ActiveAssignment} from '../../shared/models/activeAssignment.model';
import {NotificationService} from '../services/notifications.service';
import {Notification} from '../../shared/models/notification.model';
import {switchMap} from 'rxjs/operators';
import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Role} from '../../auth/models/role.model';
import {HasRoleDirective} from '../../shared/directives/HasRole.directive';

@Component({
    selector: 'app-topnav',
    imports: [
        CommonModule,
        ClickOutsideDirective,
        HasRoleDirective,
    ],
    templateUrl: './topnav.component.html',
    styleUrls: ['./topnav.component.scss'],
    standalone: true
})
export class TopnavComponent implements OnInit, OnDestroy {
    private readonly authFacade: AuthFacade = inject(AuthFacade);
    private readonly router: Router = inject(Router);
    private readonly courseService: CourseService = inject(CourseService);
    private readonly activeAssignmentService: ActiveAssignmentService = inject(ActiveAssignmentService);

    public activeAssignment$: Observable<ActiveAssignment | null> | null = null;
    public courses$: Observable<Course[]> = this.courseService.courses$;
    readonly user$: Observable<User | null> = this.authFacade.user$;
    public notifications$: Observable<Notification[]>;

    isHiddenAssignments: boolean = true;
    isHiddenProfile: boolean = true;
    isHiddenNotifications: boolean = true;

    private subscriptions: Subscription[] = [];

    constructor(private notificationService: NotificationService) {
        this.notifications$ = this.notificationService.notifications$; // Koppel de notifications$ aan de component
    }

    ngOnInit() {
        const userSubscription = this.authFacade.user$.pipe(
            switchMap(user => {
                if (user) {
                    this.notificationService.initializeWebSocket(user.id);
                    if (user.role != Role.Researcher) {
                       this.activeAssignment$ = this.activeAssignmentService.activeAssignment$;
                    }
                    return this.notificationService.getNotificationsByUserId(user.id);
                }
                return [];
            })
        ).subscribe(notifications => {
            this.notificationService.notifications$.next(notifications);
        });

        this.subscriptions.push(userSubscription);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    toggleAssignmentsHidden() {
        this.courseService.refreshCourses();
        this.isHiddenAssignments = !this.isHiddenAssignments;
    }

    closeAssignmentsDropdown() {
        this.isHiddenAssignments = true;
    }

    toggleHiddenprofile() {
        this.isHiddenProfile = !this.isHiddenProfile;
    }

    closeProfileDropdown() {
        this.isHiddenProfile = true;
    }

    navigateToProfile() {
        this.router.navigate(['/profile']);
    }

    logout(): void {
        this.authFacade.logout();
    }

    toggleNotifications() {
        this.isHiddenNotifications = !this.isHiddenNotifications;
    }

    closeNotificationsDropdown(){
        this.isHiddenNotifications = true;
    }

    deleteNotification(notificationId: number){
        if (notificationId === undefined) {
            console.error('Notification ID is undefined!');
            return;
        }
        const deleteSubscription = this.notificationService.deleteNotification(notificationId).subscribe({
            next: () => {
                const currentNotifications = this.notificationService.notifications$.getValue();
                const updatedNotifications = currentNotifications.filter(n => n.notificationId !== notificationId);
                this.notificationService.notifications$.next(updatedNotifications);
            },
            error: (error) => {
                console.error('Error deleting notification:', error);
            }
        });

        this.subscriptions.push(deleteSubscription);
    }

    navigateToNotification(notification: Notification){
        const updateSubscription = this.notificationService.markNotificationAsRead(notification.notificationId).subscribe({
            next: () => {
                const currentNotifications = this.notificationService.notifications$.getValue();
                const updatedNotifications = currentNotifications.map(n => n.notificationId === notification.notificationId
                    ? {...n, isRead: true}
                    : n);

                this.notificationService.notifications$.next(updatedNotifications);

                this.router.navigate([notification.destinationUrl]);

                this.closeNotificationsDropdown();
            },
            error: (error) => {
                console.error('Error updating notification:', error);
                this.router.navigate([notification.destinationUrl]);
            }
        });

        this.subscriptions.push(updateSubscription);
    }

    selectAssignment(assignment: Assignment, course: Course): void {
        this.activeAssignmentService.setActiveAssignment({ assignment, course });
        this.isHiddenAssignments = true;

        const courseSlug = this.slugify(course.name);
        const assignmentSlug = this.slugify(assignment.name);

        const currentUrl = this.router.url;
        const segments = currentUrl.split('/').filter(segment => segment !== '');

        if (segments.length >= 5) {
            segments[1] = courseSlug;
            segments[3] = assignmentSlug;
            this.router.navigate(['/', 'course', segments[1], 'assignment', segments[3], segments[4]]);
        } else {
            this.router.navigate(['/', 'course', courseSlug, 'assignment', assignmentSlug, 'dashboard']);
        }
    }

    private slugify(text: string): string {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/[\s\W-]+/g, '-');
    }

    closeNotifications() {
        this.isHiddenNotifications = true;
    }

    navigateToSettings() {
        this.router.navigate(['/settings']);
    }

    protected readonly Role = Role;
}
