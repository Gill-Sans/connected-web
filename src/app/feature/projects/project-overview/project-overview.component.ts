import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ProjectcardComponent} from '../../../shared/components/projectcard/projectcard.component';
import {CommonModule} from '@angular/common';
import {Router, RouterOutlet} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {BehaviorSubject, combineLatest, Observable, Subscription} from 'rxjs';
import {map, take} from 'rxjs/operators';
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

type TabValue = 'all' | 'global' | 'my projects';

type SortValue =
    | 'title-asc'
    | 'title-desc'
    | 'status-asc'
    | 'status-desc'
    | 'teamSize-asc'
    | 'teamSize-desc'
    | 'teamFill-asc'
    | 'teamFill-desc';

interface TabOption {
    label: string;
    value: TabValue;
}

interface SortOption {
    label: string;
    value: SortValue;
}

@Component({
    selector: 'app-project-overview',
    imports: [
        ProjectcardComponent,
        CommonModule,
        FormsModule,
        RouterOutlet,
        ButtonComponent,
        StatuscardComponent,
        ProjectStatusSelectComponent
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
    protected readonly ProjectStatusEnum = ProjectStatusEnum;

    projects$: Observable<Project[]> | null = null;
    public isTeacher$: Observable<boolean> = this.authorizationService.isTeacher$();
    public isResearcher$: Observable<boolean> = this.authorizationService.isResearcher$();

    activeAssignment: ActiveAssignment | null = this.activeAssignmentService.getActiveAssignment();
    selectedTab: TabValue = 'all';
    viewType: 'card' | 'table' = 'card';

    // Subscription to listen to active assignment changes
    private activeAssignmentSub?: Subscription;

    sortOptions: SortOption[] = [
        {label: 'Title (A-Z)', value: 'title-asc'},
        {label: 'Title (Z-A)', value: 'title-desc'},
        {label: 'Status (A-Z)', value: 'status-asc'},
        {label: 'Status (Z-A)', value: 'status-desc'},
        {label: 'Team Size (Largest)', value: 'teamSize-desc'},
        {label: 'Team Size (Smallest)', value: 'teamSize-asc'},
        {label: 'Team Fill (Most filled)', value: 'teamFill-desc'},
        {label: 'Team Fill (Most open)', value: 'teamFill-asc'}
    ];
    selectedSort: SortValue = 'title-asc';
    private readonly sortOption$ = new BehaviorSubject<SortValue>(this.selectedSort);

    tabOptions: TabOption[] = [];

    ngOnInit(): void {
        // Subscribe to changes in the active assignment
        this.isResearcher$.subscribe(isResearcher => {
            if (isResearcher) {
                this.tabOptions = [{label: 'Global projects', value: 'global'}];
                this.selectedTab = 'global';
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
        // Clean up subscriptions to avoid memory leaks.
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
        } else if (tab === 'my projects') {
            this.selectedTab = 'my projects';
            this.loadMyProjects();
        }
    }

    changeSort(sortValue: SortValue): void {
        this.selectedSort = sortValue;
        this.sortOption$.next(sortValue);
    }

    toggleView(): void {
        this.viewType = this.viewType === 'card' ? 'table' : 'card';
    }

    private setProjects(projectStream: Observable<Project[]>): void {
        this.projects$ = combineLatest([projectStream, this.sortOption$]).pipe(
            map(([projects, sortOption]) => this.sortProjects(projects, sortOption))
        );
    }

    loadProjects(): void {
        const assignmentId = this.activeAssignmentService.getActiveAssignment()?.assignment.id;
        if (assignmentId) {
            this.isTeacher$.pipe(take(1)).subscribe(isTeacher => {
                const projectStream = isTeacher
                    ? this.projectService.getAllProjects(assignmentId)
                    : this.projectService.getAllPublishedProjects(assignmentId);
                this.setProjects(projectStream);
            });
        }
    }

    loadMyProjects(): void {
        const assignmentId = this.activeAssignmentService.getActiveAssignment()?.assignment.id;
        if (assignmentId) {
            this.setProjects(this.projectService.getMyProjects(assignmentId));
        }
    }

    loadGlobalProjects(): void {
        this.setProjects(this.projectService.getAllGlobalProjects());
    }

    private sortProjects(projects: Project[], sortOption: SortValue): Project[] {
        const sortedProjects = [...projects];
        switch (sortOption) {
            case 'title-desc':
                return sortedProjects.sort((a, b) => this.compareStrings(b.title, a.title));
            case 'status-asc':
                return sortedProjects.sort((a, b) => this.compareStrings(a.status, b.status));
            case 'status-desc':
                return sortedProjects.sort((a, b) => this.compareStrings(b.status, a.status));
            case 'teamSize-asc':
                return sortedProjects.sort((a, b) => (a.teamSize ?? 0) - (b.teamSize ?? 0));
            case 'teamSize-desc':
                return sortedProjects.sort((a, b) => (b.teamSize ?? 0) - (a.teamSize ?? 0));
            case 'teamFill-asc':
                return sortedProjects.sort((a, b) => this.compareTeamFill(a, b, 'asc'));
            case 'teamFill-desc':
                return sortedProjects.sort((a, b) => this.compareTeamFill(a, b, 'desc'));
            case 'title-asc':
            default:
                return sortedProjects.sort((a, b) => this.compareStrings(a.title, b.title));
        }
    }

    private compareStrings(a?: string | null, b?: string | null): number {
        return (a ?? '').localeCompare(b ?? '', undefined, {sensitivity: 'base', numeric: true});
    }

    private compareTeamFill(a: Project, b: Project, direction: 'asc' | 'desc'): number {
        const fillA = this.getTeamFillRatio(a);
        const fillB = this.getTeamFillRatio(b);
        const fillComparison = this.compareNumbers(fillA, fillB);

        if (fillComparison !== 0) {
            return direction === 'asc' ? fillComparison : -fillComparison;
        }

        const vacancyA = this.getTeamVacancyCount(a);
        const vacancyB = this.getTeamVacancyCount(b);
        const vacancyComparison = this.compareNumbers(vacancyA, vacancyB);

        if (vacancyComparison !== 0) {
            return direction === 'asc' ? vacancyComparison : -vacancyComparison;
        }

        return this.compareStrings(a.title, b.title);
    }

    private getTeamFillRatio(project: Project): number {
        const capacity = project.teamSize ?? 0;
        const memberCount = project.members?.length ?? 0;

        if (capacity <= 0) {
            return memberCount > 0 ? 1 : 0;
        }

        return memberCount / capacity;
    }

    private getTeamVacancyCount(project: Project): number {
        const capacity = project.teamSize ?? 0;
        const memberCount = project.members?.length ?? 0;

        return Math.max(capacity - memberCount, 0);
    }

    private compareNumbers(a: number, b: number): number {
        if (a < b) {
            return -1;
        }

        if (a > b) {
            return 1;
        }

        return 0;
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
