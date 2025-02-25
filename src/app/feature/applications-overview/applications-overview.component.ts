import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StatuscardComponent} from '../../shared/components/statuscard/statuscard.component';
import {Router} from '@angular/router';
import {AssignmentService} from '../../core/services/assignment.service';
import {Application} from '../../shared/models/application.model';
import {Observable} from 'rxjs/internal/Observable';
import {ActiveAssignmentService} from '../../core/services/active-assignment.service';
import {ActiveAssignment} from '../../shared/models/activeAssignment.model';
import {Subscription} from 'rxjs';
import {ActiveAssignmentRoutingService} from '../../core/services/active-assignment-routing.service';

@Component({
    selector: 'app-applications-overview',
    imports: [CommonModule, StatuscardComponent],
    templateUrl: './applications-overview.component.html',
    styleUrl: './applications-overview.component.scss'
})
export class ApplicationsOverviewComponent implements OnInit, OnDestroy {
    private router: Router = inject(Router);
    private assignmentService: AssignmentService = inject(AssignmentService);
    private activeAssignmentService: ActiveAssignmentService = inject(ActiveAssignmentService);
    private readonly activeAssignmentRouteService: ActiveAssignmentRoutingService = inject(ActiveAssignmentRoutingService);

    public applications$: Observable<Application[]> | null = null;

    private activeAssignment: ActiveAssignment | null = null;

    private activeAssignmentSub?: Subscription;

    ngOnInit() {
        //hier subscriben naar de active assignment service
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

    ngOnDestroy(): void {
        if (this.activeAssignmentSub) {
            this.activeAssignmentSub.unsubscribe();
        }
    }

    loadApplications() {
        //ophalen van assignment id uit de activeassignment
        const assignmentId = this.activeAssignmentService.getActiveAssignment()?.assignment.id;
        //als assignment id bestaat, dan ophalen van alle applicaties van deze assignment
        if (assignmentId) {
            this.applications$ = this.assignmentService.getAllApplicationsFromAssignment(assignmentId);
        }
    }

    navigateToApplication(application: Application) {
        this.router.navigate(this.activeAssignmentRouteService.buildRoute('applications', application.id.toString()));
    }
}
