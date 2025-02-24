import {Component, inject, OnInit} from '@angular/core';
import {ApplicationService} from '../../../core/services/application.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from '../../../shared/components/button/button.component';
import {MarkdownModule} from 'ngx-markdown';
import {ActiveAssignmentRoutingService} from '../../../core/services/active-assignment-routing.service';
import {AuthorizationService} from '../../../core/services/authorization.service';
import {Observable} from 'rxjs';
import {Project} from '../../../shared/models/project.model';
import {ProjectService} from '../../../core/services/project.service';
import {ApplicationStatusEnum} from '../../../shared/models/ApplicationStatus.enum';
import {StatuscardComponent} from '../../../shared/components/statuscard/statuscard.component';
import {ToastService} from '../../../core/services/toast.service';
import {Application} from '../../../shared/models/application.model';

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
    application$: Observable<Application> = this.applicationService.getApplication(this.applicationId);
    projectId: number | null = null;
    public isOwner$!: Observable<boolean>;
    public isMember$!: Observable<boolean>;
    public isApplicationOwner$!: Observable<boolean>;
    public project$: Observable<Project> | null = null;
    protected readonly ApplicationStatusEnum = ApplicationStatusEnum;
    private readonly toastService: ToastService = inject(ToastService);

  ngOnInit() {
    this.application$.subscribe(application => {

      this.projectId = application.project.id;
      this.isApplicationOwner$ = this.authorizationService.isApplicationOwner$(application);
      this.project$ = this.projectService.getProjectById(this.projectId.toString());

        this.project$.subscribe(project => {
            this.isOwner$ = this.authorizationService.isOwner$(project);
            this.isMember$ = this.authorizationService.isMember$(project);
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

    reviewApplication(applicationId: number, status: ApplicationStatusEnum) {
      try {
          this.application$ = this.projectService.reviewApplication(applicationId, status);
          this.toastService.showToast("success", "Application reviewed successfully");
      } catch (error) {
          this.toastService.showToast("error", "Failed to review application");
      }

    }

    joinProject(applicationId: number) {
        try {
            this.application$ = this.projectService.joinProject(applicationId);
            this.toastService.showToast("success", "Joined project successfully");
        }
        catch (error) {
            this.toastService.showToast("error", "Failed to join project");
        }
    }
}
