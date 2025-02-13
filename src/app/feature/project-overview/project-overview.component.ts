import { Component, inject, OnInit } from '@angular/core';
import { ProjectcardComponent } from '../../shared/components/projectcard/projectcard.component';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Observable } from 'rxjs';
import { Project } from '../../shared/models/project.model';
import { ProjectService } from '../../core/services/project.service';
import { ActiveAssignmentService } from '../../core/services/active-assignment.service';
import { ActiveAssignment } from '../../shared/models/activeAssignment.model';


@Component({
    selector: 'app-project-overview',
    imports: [ProjectcardComponent, CommonModule, RouterOutlet, ButtonComponent],
    templateUrl: './project-overview.component.html',
    styleUrl: './project-overview.component.scss'
})
export class ProjectOverviewComponent implements OnInit {


    private readonly projectService: ProjectService = inject(ProjectService);
    private readonly activeAssignmentService: ActiveAssignmentService = inject(ActiveAssignmentService);

    activeAssignment: ActiveAssignment | null = this.activeAssignmentService.getActiveAssignment();


    ngOnInit(): void {
        this.loadProjects();
    }

    constructor(private router: Router) {
    }

    navigateToProjectCreate() {
        this.router.navigate(['/projects/create']);
    }


    tabOptions = [
        { label: 'All projects', value: 'all' },
        { label: 'Recommended projects', value: 'recommended' },
        { label: 'Crossover projects', value: 'crossover' }
    ];

    selectedTab: string = 'all';

    projects$: Observable<Project[]> | null = null;

    changeTab(tab: string) {
        this.selectedTab = tab;
    }

    loadProjects() {
        const assignmentId = this.activeAssignmentService.getActiveAssignment()?.assignment.id;
        if (assignmentId) {
            this.projects$ = this.projectService.getAllProjects(assignmentId);
        }
    }

}
