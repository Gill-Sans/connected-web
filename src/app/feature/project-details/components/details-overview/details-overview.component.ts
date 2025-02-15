import { Component, inject } from '@angular/core';
import { LinkcardComponent } from '../../../../shared/components/linkcard/linkcard.component';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { ProjectService } from '../../../../core/services/project.service';
import { ActiveAssignmentService } from '../../../../core/services/active-assignment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Project } from '../../../../shared/models/project.model';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ActiveAssignmentRoutingService } from '../../../../core/services/active-assignment-routing.service';
//TODO: add check if image of user is empty --> placeholderpic.svg
@Component({
    selector: 'app-details-overview',
    imports: [LinkcardComponent, CommonModule, MarkdownModule, ButtonComponent],
    templateUrl: './details-overview.component.html',
    styleUrl: './details-overview.component.scss'
})
export class DetailsOverviewComponent {
    //NOTE: als een tab inzet voor de markdown, dan wordt de markdown niet goed weergegeven
    private readonly projectService: ProjectService = inject(ProjectService);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);

    private readonly activeAssignmentService: ActiveAssignmentService = inject(ActiveAssignmentService);
    private readonly activeAssignmentRoutingService: ActiveAssignmentRoutingService = inject(ActiveAssignmentRoutingService);
    private projectId: string = 'undefined';
    public project$: Observable<Project> | null = null;
    activeAssignment$ = this.activeAssignmentService.activeAssignment$;
    private readonly router: Router = inject(Router);


    ngOnInit() {
        this.route.parent?.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.projectId = id;
                this.project$ = this.projectService.getProject(this.projectId);
            }
        })

    }

    applyForProject() {
        this.router.navigate(this.activeAssignmentRoutingService.buildRoute('projects', this.projectId, 'apply'));
    }

}
