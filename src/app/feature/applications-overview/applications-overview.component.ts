import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StatuscardComponent} from '../../shared/components/statuscard/statuscard.component';
import {Router} from '@angular/router';
import {AssignmentService} from '../../core/services/assignment.service';
import {Application} from '../../shared/models/application.model';
import {Observable} from 'rxjs/internal/Observable';
import {ActiveAssignmentService} from '../../core/services/active-assignment.service';
import {ApplicationService} from '../../core/services/application.service';
import {ActiveAssignment} from '../../shared/models/activeAssignment.model';
import {Subscription} from 'rxjs';
import {ActiveAssignmentRoutingService} from '../../core/services/active-assignment-routing.service';

@Component({
    selector: 'app-applications-overview',
    imports: [CommonModule, StatuscardComponent],
    templateUrl: './applications-overview.component.html',
    styleUrl: './applications-overview.component.scss'
})
export class ApplicationsOverviewComponent implements OnInit {
    private router = inject(Router);
    private assignmentService = inject(AssignmentService);
    private applicationService = inject(ApplicationService);
    private activeAssignmentService = inject(ActiveAssignmentService);
    private readonly activeAssignmentRouteService: ActiveAssignmentRoutingService = inject(ActiveAssignmentRoutingService);

    public applications$: Observable<Application[]> | null = null;

    private activeAssignment: ActiveAssignment | null = null;

    private activeAssignmentSub?: Subscription;

    ngOnInit() {
        this.activeAssignmentSub = this.activeAssignmentService.activeAssignment$.subscribe(
            (activeAssignment) => {
                this.activeAssignment = activeAssignment;
                // Only reload projects if an active assignment exists.
                if (activeAssignment && activeAssignment.assignment) {
                    this.loadApplications();
                }
            }
        );
    }

    loadApplications() {
        const assignmentId = this.activeAssignmentService.getActiveAssignment()?.assignment.id;
        if (assignmentId) {
            this.applications$ = this.assignmentService.getAllApplicationsFromAssignment(assignmentId);
        }
    }

    navigateToApplication(application: Application) {
        this.router.navigate(this.activeAssignmentRouteService.buildRoute('applications', application.id.toString()));
    }
}
