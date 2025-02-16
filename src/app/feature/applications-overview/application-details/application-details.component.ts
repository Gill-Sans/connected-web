import {Component, inject, OnInit} from '@angular/core';
import { ApplicationService } from '../../../core/services/application.service';
import {ActivatedRoute, Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { MarkdownModule } from 'ngx-markdown';
import {ActiveAssignmentRoutingService} from '../../../core/services/active-assignment-routing.service';
import {AuthorizationService} from '../../../core/services/authorization.service';
import {Observable} from 'rxjs';
import {Project} from '../../../shared/models/project.model';
import {ProjectService} from '../../../core/services/project.service';
import {ApplicationStatusEnum} from '../../../shared/models/ApplicationStatus.enum';
import {StatuscardComponent} from '../../../shared/components/statuscard/statuscard.component';
import {ToastService} from '../../../core/services/toast.service';

@Component({
  selector: 'app-application-details',
    imports: [CommonModule, ButtonComponent, MarkdownModule, StatuscardComponent],
  templateUrl: './application-details.component.html',
  styleUrl: './application-details.component.scss'
})

export class ApplicationDetailsComponent implements OnInit {
    private readonly applicationService = inject(ApplicationService);
    private readonly projectService: ProjectService = inject(ProjectService);
    private readonly route = inject(ActivatedRoute);
    private router: Router = inject(Router);
    private readonly activeAssignmentRouteService: ActiveAssignmentRoutingService = inject(ActiveAssignmentRoutingService);
    public authorizationService: AuthorizationService = inject(AuthorizationService);
    applicationId = this.route.snapshot.params['id'];
    application$ = this.applicationService.getApplication(this.applicationId);
    projectId: number | null = null;
    public isOwner$!: Observable<boolean>;
    public project$: Observable<Project> | null = null;
    protected readonly ApplicationStatusEnum = ApplicationStatusEnum;
    private readonly toastService: ToastService = inject(ToastService);

  ngOnInit() {
    this.application$.subscribe(application => {
        console.log('Application:', application);
        console.log('Application Status:', application.status);
        console.log('Pending Status Enum:', ApplicationStatusEnum.PENDING);
      this.projectId = application.project.id;

        this.project$ = this.projectService.getProject(this.projectId.toString());

        this.project$.subscribe(project => {
            this.isOwner$ = this.authorizationService.isOwner$(project);
        });
    });
  }

    navigateToProject() {
      if (this.projectId === null) {
        console.error('Project ID is not set');
        return;
      }
        this.router.navigate(this.activeAssignmentRouteService.buildRoute('projects', this.projectId.toString()));
    }


    approveApplication(applicationId: number) {
        if(this.projectId){
            console.log("approveApplication", applicationId)
            this.projectService.approveApplication(this.projectId.toString(), applicationId)
                .subscribe(() => {
                    this.application$ = this.applicationService.getApplication(this.applicationId);
                    this.toastService.showToast("success", "Application approved")
                })
            console.log("application approved")
        }
    }

    rejectApplication(applicationId: number) {
        if (this.projectId) {
            console.log("rejectApplication", applicationId)
            this.projectService.rejectApplication(this.projectId.toString(), applicationId)
                .subscribe(() => {
                    this.application$ = this.applicationService.getApplication(this.applicationId);
                    this.toastService.showToast("success", "Application rejected");
                });
            console.log("application rejected")
        }
    }
}
