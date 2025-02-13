import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ProjectcardComponent } from '../../shared/components/projectcard/projectcard.component';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Observable, Subscription } from 'rxjs';
import { Project } from '../../shared/models/project.model';
import { ProjectService } from '../../core/services/project.service';
import { ActiveAssignmentService } from '../../core/services/active-assignment.service';
import { ActiveAssignment } from '../../shared/models/activeAssignment.model';
import { ActiveAssignmentRoutingService } from '../../core/services/active-assignment-routing.service';

@Component({
    selector: 'app-project-overview',
    imports: [ProjectcardComponent, CommonModule, RouterOutlet, ButtonComponent],
    templateUrl: './project-overview.component.html',
    styleUrl: './project-overview.component.scss'
})
export class ProjectOverviewComponent implements OnInit, OnDestroy {
    private readonly projectService: ProjectService = inject(ProjectService);
    private readonly activeAssignmentService: ActiveAssignmentService = inject(ActiveAssignmentService);
    private readonly activeAssignmentRoutingService = inject(ActiveAssignmentRoutingService);
    router: Router = inject(Router);

    projects$: Observable<Project[]> | null = null;
    activeAssignment: ActiveAssignment | null = this.activeAssignmentService.getActiveAssignment();
    selectedTab: string = 'all';

    // Subscription to listen to active assignment changes
    private activeAssignmentSub?: Subscription;

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
    }

    ngOnDestroy(): void {
        // Clean up subscription to avoid memory leaks.
        this.activeAssignmentSub?.unsubscribe();
    }

    navigateToProjectCreate(): void {
        const builtRoute = this.activeAssignmentRoutingService.buildRoute('projects', 'create');
        this.router.navigate(builtRoute);
    }

    tabOptions = [
        { label: 'All projects', value: 'all' },
        { label: 'Recommended projects', value: 'recommended' },
        { label: 'Crossover projects', value: 'crossover' }
    ];

    changeTab(tab: string): void {
        this.selectedTab = tab;
    }

    loadProjects(): void {
        const assignmentId = this.activeAssignmentService.getActiveAssignment()?.assignment.id;
        if (assignmentId) {
            this.projects$ = this.projectService.getAllProjects(assignmentId);
        }
    }
}
