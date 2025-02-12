import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatuscardComponent } from '../../shared/components/statuscard/statuscard.component';
import { Router,ActivatedRoute  } from '@angular/router';
import { AssignmentService } from '../../core/services/assignment.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Application } from '../../shared/models/application.model';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../../auth/models/user.model';
import { ApplicationStatusEnum } from '../../shared/models/ApplicationStatus.enum';

@Component({
    selector: 'app-applications-overview',
    imports: [CommonModule, StatuscardComponent],
    templateUrl: './applications-overview.component.html',
    styleUrl: './applications-overview.component.scss'
})
export class ApplicationsOverviewComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private assignmentService = inject(AssignmentService);
  applications$: Observable<Application[]> | null = null;

  ngOnInit() {
     if (!this.route.snapshot.params['id']) {
      console.error("No assignment id provided!");
      return;
     }
     this.applications$ = this.assignmentService.getAllApplicationsFromAssignment(this.route.snapshot.params['id']);
  }
  
  applications = [{
    first_name: "Steve",last_name:"van der Beek" , project: "ConnectEd", status: "Pending", image: "icons/placeholderpic.svg"
  },
  {
    first_name: "Wim", last_name: "van der Beek", project: "ConnectEd", status: "Approved", image: "icons/placeholderpic.svg"
  },
  {
    first_name: "Lucas", last_name:"Lebron",project: "ConnectEd", status: "Rejected", image: "icons/placeholderpic.svg"
  }
]

  
  

navigateToApplication(application: any) {
  // Vervang '/application' met je gewenste route
  this.router.navigate(['/application', application.id]);
  // Voor nu loggen we alleen
  console.log('Navigating to application:', application);

}
}
