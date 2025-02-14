import { Component, inject } from '@angular/core';
import { StatuscardComponent } from '../../../../shared/components/statuscard/statuscard.component';
import { CommonModule } from '@angular/common';
import { ApplicationStatusEnum } from '../../../../shared/models/ApplicationStatus.enum';
import { Application } from '../../../../shared/models/application.model';
import { ProjectService } from '../../../../core/services/project.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ActiveAssignmentService } from '../../../../core/services/active-assignment.service';
import { Project } from '../../../../shared/models/project.model';


@Component({
    selector: 'app-applications',
    imports: [CommonModule,StatuscardComponent],
    templateUrl: './applications.component.html',
    styleUrl: './applications.component.scss'
})
export class ApplicationsComponent {
 
  private readonly projectService: ProjectService = inject(ProjectService);
   private readonly route: ActivatedRoute = inject(ActivatedRoute);
   
   private readonly activeAssignmentService: ActiveAssignmentService = inject(ActiveAssignmentService);
   private projectId: string = 'undefined';
   public project$ : Observable<Application[]> | null = null;
   activeAssignment$ = this.activeAssignmentService.activeAssignment$;


   ngOnInit(){
    this.route.parent?.params.subscribe(params => {
      const id = params['id'];
      if(id){
        this.projectId = id;
        this.project$ = this.projectService.getProjectApplications(this.projectId);
      }
    })
   }


   approveApplication(applicationId: number){
    if(this.projectId){
      console.log("approveApplication", applicationId)
      this.projectService.approveApplication(this.projectId, applicationId)
      .subscribe(() => {
        //refresh the applicationlist
        this.project$ = this.projectService.getProjectApplications(this.projectId);
      })
      console.log("application approved")
    }
   }

   rejectApplication(applicationId: number) {
        if (this.projectId) {
          console.log("rejectApplication", applicationId)
            this.projectService.rejectApplication(this.projectId, applicationId)
                .subscribe(() => {
                    // Refresh the applications list
                    this.project$ = this.projectService.getProjectApplications(this.projectId);
                });
                console.log("application rejected")
        }
    }

}
