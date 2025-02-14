import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import {Router, RouterModule} from '@angular/router';
import {ButtonComponent} from '../../shared/components/button/button.component';
import {ActiveAssignmentRoutingService} from '../../core/services/active-assignment-routing.service';
import { ProjectService } from '../../core/services/project.service';
@Component({
    selector: 'app-project-details',
    imports: [CommonModule, RouterModule, ButtonComponent],
    templateUrl: './project-details.component.html',
    styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent {
    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly activeAssignmentService: ActiveAssignmentRoutingService = inject(ActiveAssignmentRoutingService);
    private readonly projectService: ProjectService = inject(ProjectService);
    projectId = this.route.snapshot.params['projectId'];
    project$ = this.projectService.getProject(this.projectId);

    ngOnInit() {
        this.project$.subscribe(project => {
            console.log('Project:', project);
        });
    }


    navigateBack() {
        this.router.navigate(this.activeAssignmentService.buildRoute('projects'));
    }
}
