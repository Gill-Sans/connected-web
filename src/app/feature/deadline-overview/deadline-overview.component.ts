import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Deadline} from '../../shared/models/deadline.model';
import {Observable, Subscription} from 'rxjs';
import {DeadlineService} from '../../core/services/deadline.service';
import {ActiveAssignmentService} from '../../core/services/active-assignment.service';
import {ActiveAssignment} from '../../shared/models/activeAssignment.model';
import {CommonModule} from '@angular/common';
import {AuthorizationService} from '../../core/services/authorization.service';
import {ButtonComponent} from '../../shared/components/button/button.component';

@Component({
  selector: 'app-deadline-overview',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './deadline-overview.component.html',
  styleUrl: './deadline-overview.component.scss'
})
export class DeadlineOverviewComponent implements OnInit, OnDestroy {

    private readonly deadlineService: DeadlineService = inject(DeadlineService);
    private readonly activeAssignmentService: ActiveAssignmentService = inject(ActiveAssignmentService);
    private readonly authorizationService: AuthorizationService = inject(AuthorizationService);

    public isTeacher$: Observable<boolean> = this.authorizationService.isTeacher$();

    deadlines$: Observable<Deadline[]> | null = null;

    activeAssignment: ActiveAssignment | null = this.activeAssignmentService.getActiveAssignment();

    private activeAssignmentSub?: Subscription;

    ngOnInit(): void {
        // Subscribe to changes in the active assignment
        this.activeAssignmentSub = this.activeAssignmentService.activeAssignment$.subscribe(
            (activeAssignment) => {
                this.activeAssignment = activeAssignment;
                // Only reload deadlines if an active assignment exists.
                if (activeAssignment && activeAssignment.assignment) {
                    this.loadDeadlinesForAssignment();
                }
            }
        );
    }

    loadDeadlinesForAssignment(): void {
        const assignmentId = this.activeAssignmentService.getActiveAssignment()?.assignment.id;
        if (assignmentId) {
            this.deadlines$ = this.deadlineService.getAllDeadlinesForAssignment(assignmentId);
        }
    }

    ngOnDestroy(): void {
        this.activeAssignmentSub?.unsubscribe();
    }

}
