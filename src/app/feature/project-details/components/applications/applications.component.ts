import {Component, inject, OnInit} from '@angular/core';
import {StatuscardComponent} from '../../../../shared/components/statuscard/statuscard.component';
import {CommonModule} from '@angular/common';
import {ApplicationStatusEnum} from '../../../../shared/models/ApplicationStatus.enum';
import {Application} from '../../../../shared/models/application.model';
import {ProjectService} from '../../../../core/services/project.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {ActiveAssignmentRoutingService} from '../../../../core/services/active-assignment-routing.service';
import {ToastService} from '../../../../core/services/toast.service';


@Component({
    selector: 'app-applications',
    imports: [CommonModule,StatuscardComponent],
    templateUrl: './applications.component.html',
    styleUrl: './applications.component.scss'
})
export class ApplicationsComponent implements OnInit {

    readonly projectService: ProjectService = inject(ProjectService);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);

    private projectId: string = 'undefined';
    public applications$ : Observable<Application[]> | null = null;
    private router: Router = inject(Router);
    private readonly activeAssignmentRouteService: ActiveAssignmentRoutingService = inject(ActiveAssignmentRoutingService);
    protected readonly ApplicationStatusEnum = ApplicationStatusEnum;
    private readonly toastService: ToastService = inject(ToastService);


   ngOnInit(){
    this.route.parent?.params.subscribe(params => {
      const id = params['id'];
      if(id){
        this.projectId = id;
        this.applications$ = this.projectService.getProjectApplications(this.projectId);
      }
    })
   }


   approveApplication(applicationId: number){
      this.projectService.reviewApplication(applicationId, ApplicationStatusEnum.APPROVED)
      .subscribe(() => {
        //refresh the applicationlist
        this.applications$ = this.projectService.getProjectApplications(this.projectId);
        this.toastService.showToast("success", "Application approved")
      })
      console.log("application approved")
    }

   rejectApplication(applicationId: number) {
            this.projectService.reviewApplication(applicationId, ApplicationStatusEnum.REJECTED)
                .subscribe(() => {
                    // Refresh the applications list
                    this.applications$ = this.projectService.getProjectApplications(this.projectId);
                    this.toastService.showToast("success", "Application rejected");
                });
        }

    navigateToApplication(applicationId: number) {
        this.router.navigate(this.activeAssignmentRouteService.buildRoute('applications', applicationId.toString()));
    }
}
