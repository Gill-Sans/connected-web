import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ActiveAssignmentRoutingService } from '../../core/services/active-assignment-routing.service';

@Component({
    selector: 'app-project-details',
    imports: [CommonModule, RouterModule, ButtonComponent],
    templateUrl: './project-details.component.html',
    styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent {
    private readonly router: Router = inject(Router);
    private readonly activeAssignmentService: ActiveAssignmentRoutingService = inject(ActiveAssignmentRoutingService);

    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private projectId: string = 'undefined';

    ngOnInit() {
        this.route.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.projectId = id;
            }
        })

    }

    navigateBack() {
        this.router.navigate(this.activeAssignmentService.buildRoute('projects'));
    }

    applyForProject() {
        this.router.navigate(this.activeAssignmentService.buildRoute('projects', this.projectId, 'apply'));
    }
}
