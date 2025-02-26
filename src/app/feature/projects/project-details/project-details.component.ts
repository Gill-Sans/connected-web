import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ActiveAssignmentRoutingService } from '../../../core/services/active-assignment-routing.service';
import {Observable, Subscription} from 'rxjs';
import {Project} from '../../../shared/models/project.model';
import {ProjectService} from '../../../core/services/project.service';
import {AuthorizationService} from '../../../core/services/authorization.service';

@Component({
    selector: 'app-project-details',
    imports: [CommonModule, RouterModule],
    templateUrl: './project-details.component.html',
    styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {
    private readonly router: Router = inject(Router);
    private readonly activeAssignmentService: ActiveAssignmentRoutingService = inject(ActiveAssignmentRoutingService);
    private readonly projectService: ProjectService = inject(ProjectService);
    public authorizationService: AuthorizationService = inject(AuthorizationService);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);

    public project$: Observable<Project> | null = null;
    public canManageProject$!: Observable<boolean>;
    public isOwner$!: Observable<boolean>;

    private projectId: string = 'undefined';
    private subscriptions: Subscription[] = [];

    ngOnInit() {
        // Get project ID from parent route parameters
        const routeSubscription = this.route.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.projectId = id;
                this.project$ = this.projectService.getProjectById(id);

                const projectSubscription = this.project$.subscribe(project => {
                    this.isOwner$ = this.authorizationService.isOwner$(project);
                    this.canManageProject$ = this.authorizationService.canManageProject$(project);
                    console.log(this.canManageProject$);
                });

                this.subscriptions.push(projectSubscription);
            }
        });

        this.subscriptions.push(routeSubscription);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    navigateBack() {
        this.router.navigate(this.activeAssignmentService.buildRoute('projects'));
    }
}
