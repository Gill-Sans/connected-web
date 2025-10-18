import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ProjectcardComponent} from '../../../shared/components/projectcard/projectcard.component';
import {CommonModule} from '@angular/common';
import {Router, RouterOutlet} from '@angular/router';
import {Observable, Subscription, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {Project} from '../../../shared/models/project.model';
import {ProjectService} from '../../../core/services/project.service';
import {ToastService} from '../../../core/services/toast.service';
import {ActiveAssignmentService} from '../../../core/services/active-assignment.service';
import {ActiveAssignment} from '../../../shared/models/activeAssignment.model';
import {ActiveAssignmentRoutingService} from '../../../core/services/active-assignment-routing.service';
import {ProjectStatusEnum} from '../../../shared/models/ProjectStatus.enum';
import {AuthorizationService} from '../../../core/services/authorization.service';
import {ButtonComponent} from '../../../shared/components/button/button.component';
import {StatuscardComponent} from '../../../shared/components/statuscard/statuscard.component';
import {
    ProjectStatusSelectComponent
} from '../../../shared/components/project-status-select/project-status-select.component';
import {ConfirmationModalComponent} from '../../../shared/components/confirmation-modal/confirmation-modal.component';

type TabValue = 'all' | 'global' | 'my projects';

interface TabOption {
    label: string;
    value: TabValue;
}

@Component({
    selector: 'app-project-overview',
    imports: [
        ProjectcardComponent,
        CommonModule,
        RouterOutlet,
        ButtonComponent,
        StatuscardComponent,
        ProjectStatusSelectComponent,
        ConfirmationModalComponent
    ],
    templateUrl: './project-overview.component.html',
    styleUrl: './project-overview.component.scss'
})
export class ProjectOverviewComponent implements OnInit, OnDestroy {
    private readonly projectService: ProjectService = inject(ProjectService);
    private readonly activeAssignmentService: ActiveAssignmentService = inject(ActiveAssignmentService);
    private readonly activeAssignmentRoutingService = inject(ActiveAssignmentRoutingService);
    private readonly router: Router = inject(Router);
    private readonly toastService = inject(ToastService);
    private readonly authorizationService: AuthorizationService = inject(AuthorizationService);

    showStatusUpdateModal = false;
    pendingStatusProject: Project | null = null;
    pendingStatus: ProjectStatusEnum | null = null;
    // Store original status so we can revert UI if the user cancels
    pendingOriginalStatus: ProjectStatusEnum | null = null;

    projects$: Observable<Project[]> | null = null;
    public isTeacher$: Observable<boolean> = this.authorizationService.isTeacher$();
    public isResearcher$: Observable<boolean> = this.authorizationService.isResearcher$();

    activeAssignment: ActiveAssignment | null = this.activeAssignmentService.getActiveAssignment();
    selectedTab: 'all' | 'global' | 'my projects' = 'all';
    viewType: 'card' | 'table' = 'card';

    private activeAssignmentSub?: Subscription;



    tabOptions: TabOption[] = [];

    ngOnInit(): void {
        // Subscribe to changes in the active assignment
        this.isResearcher$.subscribe(isResearcher => {
            if (isResearcher) {
                this.tabOptions = [{label: 'Global projects', value: 'global'}];
                this.selectedTab = "global";
                this.loadGlobalProjects();
            } else {
                this.tabOptions = [
                    {label: 'All projects', value: 'all'},
                    {label: 'Global projects', value: 'global'},
                    {label: 'My projects', value: 'my projects'}
                ];
                this.activeAssignmentSub = this.activeAssignmentService.activeAssignment$.subscribe((activeAssignment) => {
                    this.activeAssignment = activeAssignment;
                    // Only reload projects if an active assignment exists.
                    if (activeAssignment && activeAssignment.assignment) {

                        this.loadProjects();

                    }
                });
            }


        });


        // Subscribe to user changes to check for teacher role
        this.isTeacher$.subscribe(isTeacher => {
            this.viewType = isTeacher ? 'table' : 'card';
        });
    }

    ngOnDestroy(): void {
        this.activeAssignmentSub?.unsubscribe();
    }

    navigateToProjectCreate(): void {
        const builtRoute = this.activeAssignmentRoutingService.buildRoute('projects', 'create');
        this.router.navigate(builtRoute);
    }

    changeTab(tab: TabValue): void {
        if (tab === 'all') {
            this.selectedTab = 'all';
            this.loadProjects();
        } else if (tab === 'global') {
            this.selectedTab = 'global';
            this.loadGlobalProjects();
        }else if (tab === 'my projects') {
            this.selectedTab = 'my projects'
            this.loadMyProjects();
        }
    }

    toggleView(): void {
        this.viewType = this.viewType === 'card' ? 'table' : 'card';
    }

    loadProjects(): void {
        const assignmentId = this.activeAssignmentService.getActiveAssignment()?.assignment.id;
        if (!assignmentId) {
            this.projects$ = of([]);
            return;
        }

        // Use the isTeacher$ stream to pick the right endpoint without manual subscription
        this.projects$ = this.isTeacher$.pipe(
            switchMap(isTeacher => {
                if (isTeacher) {
                    return this.projectService.getAllProjects(assignmentId);
                }
                return this.projectService.getAllPublishedProjects(assignmentId);
            })
        );
    }

    loadMyProjects(): void {
        const assignmentId = this.activeAssignmentService.getActiveAssignment()?.assignment.id;
        if (assignmentId) {
            this.projects$ = this.projectService.getMyProjects(assignmentId);
        }
    }

    loadGlobalProjects(): void {
        this.projects$ = this.projectService.getAllGlobalProjects();
    }

    /**
     * Show confirmation modal only when changing status to REJECTED.
     * For other statuses update immediately.
     */
    promptStatusUpdate(project: Project, status: ProjectStatusEnum): void {
        // store original status so we can revert if cancelled
        this.pendingOriginalStatus = project.status as ProjectStatusEnum;

        if(status === ProjectStatusEnum.REJECTED) {
            this.pendingStatusProject = project;
            this.pendingStatus = status;
            this.showStatusUpdateModal = true;
        }else {
            this.projectService.updateProjectStatus(project.id, status).subscribe(() => {
                this.toastService.showToast('success', 'Project status updated ');
                this.reloadCurrentTabProjects();
            });
        }
    }


    confirmStatusUpdate(): void {
        if (this.pendingStatusProject && this.pendingStatus !== null) {
            this.projectService.updateProjectStatus(this.pendingStatusProject.id, this.pendingStatus).subscribe(() => {
                this.toastService.showToast('success', 'Project status updated ');
                this.reloadCurrentTabProjects();
            });
        }
        this.showStatusUpdateModal = false;
        this.pendingStatusProject = null;
        this.pendingStatus = null;
        this.pendingOriginalStatus = null;
    }

    cancelStatusUpdate(): void {
        // revert any UI change by reloading the current tab projects
        this.showStatusUpdateModal = false;
        this.pendingStatusProject = null;
        this.pendingStatus = null;
        this.pendingOriginalStatus = null;
        this.reloadCurrentTabProjects();
    }

    private reloadCurrentTabProjects(): void {
        if (this.selectedTab === 'all') {
            this.loadProjects();
        } else if (this.selectedTab === 'global') {
            this.loadGlobalProjects();
        } else if (this.selectedTab === 'my projects') {
            this.loadMyProjects();
        }
    }

    publishAllProjects(): void {
        if (this.activeAssignment) {
            this.projectService.publishAllProjects(this.activeAssignment.assignment.id).subscribe(() => {
                this.toastService.showToast('success', 'All approved projects were published');
                this.loadProjects();
            });
        }
    }

    get pendingStatusLabel(): string {
        if (this.pendingStatus === null) return '';
        return (ProjectStatusEnum as any)[this.pendingStatus] ?? String(this.pendingStatus);
    }

    navigateToProject(project: Project): void {
        this.router.navigate(this.activeAssignmentRoutingService.buildRoute('projects', project.id.toString()));
    }

}
