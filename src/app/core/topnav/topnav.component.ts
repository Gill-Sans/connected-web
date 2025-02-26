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
import { NotificationService } from '../services/notifications.service';
import { Notification } from '../../shared/models/notification.model';
import {switchMap } from 'rxjs/operators';
import {AuthService} from '../../auth/auth.service';

@Component({
    selector: 'app-topnav',
    imports: [
        CommonModule,
        ClickOutsideDirective,
    ],
    templateUrl: './topnav.component.html',
    styleUrls: ['./topnav.component.scss'],
    standalone: true
})
export class TopnavComponent implements OnInit{
    private readonly authFacade: AuthFacade = inject(AuthFacade);
    private readonly router: Router = inject(Router);
    private readonly courseService: CourseService = inject(CourseService);
    private readonly activeAssignmentService: ActiveAssignmentService = inject(ActiveAssignmentService);
    public readonly authService: AuthService = inject(AuthService);

    public activeAssignment$: Observable<ActiveAssignment | null> = this.activeAssignmentService.activeAssignment$;
    public courses$: Observable<Course[]> = this.courseService.courses$;
    readonly user$: Observable<User | null> = this.authFacade.user$;
    public notifications$: Observable<Notification[]>;

    public Role: typeof Role = Role;
    isHiddenAssignments: boolean = true;
    isHiddenProfile: boolean = true;
    isHiddenNotifications: boolean = true;

    constructor(private notificationService: NotificationService) {
        this.notifications$ = this.notificationService.notifications$; // Koppel de notifications$ aan de component
    }

    ngOnInit() {
        this.authFacade.user$.pipe(
            switchMap(user => {
                if (user) {
                    this.notificationService.initializeWebSocket(user.id); // Initialiseer de WebSocket-verbinding met userId
                    return this.notificationService.notifications$; // Retourneer de notifications$ Observable
                }
                return []; // Zorg ervoor dat je hier een Observable retourneert
            })
        ).subscribe(); // Abonneer op de Observable
    }

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

    logout(): void {
        console.log('Logging out...');
        this.authService.logout();
    }

    toggleNotifications() {
        this.isHiddenNotifications = !this.isHiddenNotifications;

        // Fetch notifications when the dropdown is opened
        if (!this.isHiddenNotifications) {
            //fetch notifications based on user id
            this.authFacade.user$.pipe(
                switchMap(user => {
                    if (user) {
                        return this.notificationService.getNotificationsByUserId(user.id);
                    }
                    return [];
                })
            ).subscribe(notifications => {
                this.notificationService.notifications$.next(notifications);

            }
        );
        }
    }

    closeNotificationsDropdown(){
        this.isHiddenNotifications = true;
    }

    deleteNotification(notificationId: number){

        if (notificationId === undefined) {
            console.error('Notification ID is undefined!');
            return;
        }
       this.notificationService.deleteNotification(notificationId).subscribe({
        next: () => {
            //refresh notifications
            const currentNotifications = this.notificationService.notifications$.getValue();
            const updatedNotifications = currentNotifications.filter(n => n.notificationId !== notificationId);
            this.notificationService.notifications$.next(updatedNotifications);
        },
        error: (error) => {
            console.error('Error deleting notification:', error);
        }
       })
    }

    navigateToNotification(notification: Notification){
        //mark notification as read
        this.notificationService.updateNotificationAsRead(notification.notificationId).subscribe({
            next: () => {
                //update notification status in local list
                const currentNotifications = this.notificationService.notifications$.getValue();
                const updatedNotifications = currentNotifications.map(n => n.notificationId === notification.notificationId
                    ? {...n, isRead: true}
                    : n);

            this.notificationService.notifications$.next(updatedNotifications);

            //navigate to destination url
            console.log('Navigating to:', notification.destinationUrl);
            this.router.navigate([notification.destinationUrl]);

            //close notifications dropdown
            this.closeNotificationsDropdown();
            },
            error: (error) => {
                console.error('Error updating notification:', error);
                //even if the update fails, navigate to the destination url
                this.router.navigate([notification.destinationUrl]);
            }
        })
    }


    selectAssignment(assignment: Assignment, course: Course): void {
        // Set the active assignment in the service.
        this.activeAssignmentService.setActiveAssignment({ assignment, course });
        this.isHiddenAssignments = true;

        // Create URL-friendly slugs.
        const courseSlug = this.slugify(course.name);
        const assignmentSlug = this.slugify(assignment.name);

        // Get the current URL (e.g., "/java-advanced/doesitwork/projects").
        const currentUrl = this.router.url;
        // Split into segments, filtering out any empty segments.
        const segments = currentUrl.split('/').filter(segment => segment !== '');

        if (segments.length >= 3) {
            // Assume the first two segments are the active assignment context.
            segments[0] = courseSlug;
            segments[1] = assignmentSlug;
            // Navigate to the updated URL (e.g., "/new-course-slug/new-assignment-slug/projects").
            this.router.navigate(['/' + segments.join('/')]);
        } else {
            // If no active assignment context is found in the URL, navigate to the default dashboard.
            this.router.navigate(['/', courseSlug, assignmentSlug, 'dashboard']);
        }
    }



    private slugify(text: string): string {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/[\s\W-]+/g, '-');  // Replace spaces and non-word characters with a dash
    }


    navigateToSettings() {
        this.router.navigate(['/settings']);
    }
}
