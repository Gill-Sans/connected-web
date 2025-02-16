import {Component, inject, OnInit} from '@angular/core';
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
import {AuthorizationService} from '../../../../core/services/authorization.service';
import {ProjectStatusEnum} from '../../../../shared/models/ProjectStatus.enum';
//TODO: add check if image of user is empty --> placeholderpic.svg
@Component({
    selector: 'app-details-overview',
    imports: [LinkcardComponent, CommonModule, MarkdownModule, ButtonComponent],
    templateUrl: './details-overview.component.html',
    styleUrl: './details-overview.component.scss'
})
export class DetailsOverviewComponent implements OnInit {
    //NOTE: als een tab inzet voor de markdown, dan wordt de markdown niet goed weergegeven
    private readonly projectService: ProjectService = inject(ProjectService);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    public authorizationService: AuthorizationService = inject(AuthorizationService);
    private readonly activeAssignmentService: ActiveAssignmentService = inject(ActiveAssignmentService);
    private readonly activeAssignmentRoutingService: ActiveAssignmentRoutingService = inject(ActiveAssignmentRoutingService);
    private readonly router: Router = inject(Router);
    protected readonly ProjectStatusEnum = ProjectStatusEnum;

    public project$: Observable<Project> | null = null;
    public canManageProject$!: Observable<boolean>;
    public isMember$!: Observable<boolean>;
    public isTeacher$!: Observable<boolean>;

    private projectId: number | null = null;


    ngOnInit() {
        // Get project ID from parent route parameters
        this.route.parent?.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.projectId = id;
                this.project$ = this.projectService.getProject(id);

                // Combine the project stream with the authorization check
                this.project$.subscribe(project => {
                    this.canManageProject$ = this.authorizationService.canManageProject$(project);
                    this.isMember$ = this.authorizationService.isMember$(project);
                    this.isTeacher$ = this.authorizationService.isTeacher$();
                });
            }
        });
    }

    applyForProject() {
        if (this.projectId) {
            this.router.navigate(this.activeAssignmentRoutingService.buildRoute('projects', this.projectId.toString(), 'apply'));
        }
    }

    getFilteredMembers(members: any[], owner: any): any[] {
        return members.filter(member => member.id !== owner.id);
    }

    updateProjectStatus(status: ProjectStatusEnum) {
        if (this.projectId) {
            this.projectService.updateProjectStatus(this.projectId, status).subscribe(
                (updatedProject: Project) => {
                    this.project$ = new Observable<Project>(subscriber => subscriber.next(updatedProject));
                }
            );
        }
    }
}
