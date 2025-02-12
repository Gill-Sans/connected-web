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
import { ActiveAssignmentService } from '../../core/services/active-assignment.service';
import { filter } from 'rxjs/internal/operators/filter';
import { switchMap } from 'rxjs/internal/operators/switchMap';
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
  private activeAssignmentService = inject(ActiveAssignmentService);
  public applications$: Observable<Application[]> | null = null;
  private activeAssignment = this.activeAssignmentService.getActiveAssignment();

  ngOnInit() {
     if (this.activeAssignment?.assignment.canvasAssignmentId) {
       this.applications$ = this.assignmentService.getAllApplicationsFromAssignment(this.activeAssignment.assignment.canvasAssignmentId);
     }
  }
  
  navigateToApplication(application: Application) {
  
  this.router.navigate(['/application', application.id]);
  
  console.log('Navigating to application:', application);

  }
} 
