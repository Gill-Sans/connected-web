import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ProjectcardComponent} from '../../shared/components/projectcard/projectcard.component';
import {CommonModule} from '@angular/common';
import {Router, RouterOutlet} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {Project} from '../../shared/models/project.model';
import {ProjectService} from '../../core/services/project.service';
import {ToastService} from '../../core/services/toast.service';
import {ActiveAssignmentService} from '../../core/services/active-assignment.service';
import {ActiveAssignment} from '../../shared/models/activeAssignment.model';
import {ActiveAssignmentRoutingService} from '../../core/services/active-assignment-routing.service';
import {User} from '../../auth/models/user.model';
import {AuthFacade} from '../../auth/store/auth.facade';
import {Role} from '../../auth/models/role.model';
import {ProjectStatusEnum} from '../../shared/models/ProjectStatus.enum';
import {AuthorizationService} from '../../core/services/authorization.service';

@Component({
    selector: 'app-project-overview',
    imports: [ProjectcardComponent, CommonModule, RouterOutlet],
    templateUrl: './project-overview.component.html',
    styleUrl: './project-overview.component.scss'
})
export class ProjectOverviewComponent implements OnInit, OnDestroy {
    private readonly projectService: ProjectService = inject(ProjectService);
    private readonly activeAssignmentService: ActiveAssignmentService = inject(ActiveAssignmentService);
    private readonly activeAssignmentRoutingService = inject(ActiveAssignmentRoutingService);
    private router: Router = inject(Router);
    private readonly authFacade = inject(AuthFacade);
    private readonly toastService = inject(ToastService);
    private readonly authorizationService: AuthorizationService = inject(AuthorizationService);
    protected readonly ProjectStatusEnum = ProjectStatusEnum;

    user$: Observable<User | null> = this.authFacade.user$;
    projects$: Observable<Project[]> | null = null;
    activeAssignment: ActiveAssignment | null = this.activeAssignmentService.getActiveAssignment();
    selectedTab: string = 'all';

    // New properties for teacher role and view toggle
    viewType: 'card' | 'table' = 'card';

    // Subscription to listen to active assignment changes
    private activeAssignmentSub?: Subscription;
    private userSub?: Subscription;
    public isTeacher$!: Observable<boolean>;

    ngOnInit(): void {
        // Subscribe to changes in the active assignment
        this.activeAssignmentSub = this.activeAssignmentService.activeAssignment$.subscribe(
            (activeAssignment) => {
                this.activeAssignment = activeAssignment;
                // Only reload projects if an active assignment exists.
                if (activeAssignment && activeAssignment.assignment) {
                    this.loadProjects();
                }
            }
        );

        // Subscribe to user changes to check for teacher role
        this.userSub = this.user$.subscribe((user) => {
            this.isTeacher$ = this.authorizationService.isTeacher$();
            this.isTeacher$.subscribe(isTeacher => {
                // If the user is a teacher, start on the list view (table view)
                this.viewType = isTeacher ? 'table' : 'card';
                // Reload projects if necessary
                if (this.activeAssignment && this.activeAssignment.assignment) {
                    this.loadProjects();
                }
            });
            // After detecting the role, reload projects if necessary
            if (this.activeAssignment && this.activeAssignment.assignment) {
                this.loadProjects();
            }
        });
    }

    ngOnDestroy(): void {
        // Clean up subscriptions to avoid memory leaks.
        this.activeAssignmentSub?.unsubscribe();
        this.userSub?.unsubscribe();
    }

    navigateToProjectCreate(): void {
        const builtRoute = this.activeAssignmentRoutingService.buildRoute('projects', 'create');
        this.router.navigate(builtRoute);
    }

    tabOptions = [
        { label: 'All projects', value: 'all' },
    ];

    changeTab(tab: string): void {
        this.selectedTab = tab;
    }

    toggleView(): void {
        this.viewType = this.viewType === 'card' ? 'table' : 'card';
    }

    loadProjects(): void {
        const assignmentId = this.activeAssignmentService.getActiveAssignment()?.assignment.id;
        if (assignmentId) {
            this.isTeacher$.subscribe(isTeacher => {
                if (isTeacher) {
                    this.projects$ = this.projectService.getAllProjects(assignmentId);
                } else {
                    this.projects$ = this.projectService.getAllPublishedProjects(assignmentId);
                }
            });
        }
    }

    updateProjectStatus(project: Project, status: ProjectStatusEnum): void {
        this.projectService.updateProjectStatus(project.id, status).subscribe(() => {
            this.toastService.showToast('success', 'Project status updated to ' + ProjectStatusEnum[status]);
            this.loadProjects();
        });
    }

    publishAllProjects(): void {
        if (this.activeAssignment) {
            this.projectService.publishAllProjects(this.activeAssignment.assignment.id).subscribe(() => {
                this.toastService.showToast('success', 'All approved projects were published');
                this.loadProjects();
            });
        }
    }

    get publishedStatus(): string {
        return ProjectStatusEnum[ProjectStatusEnum.PUBLISHED];
    }

    navigateToProject(project: Project): void {
        this.router.navigate(this.activeAssignmentRoutingService.buildRoute('projects', project.id.toString()));
    }
}
