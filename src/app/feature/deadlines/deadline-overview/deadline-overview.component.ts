import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Deadline } from '../../../shared/models/deadline.model';
import { Observable, Subscription } from 'rxjs';
import { DeadlineService } from '../../../core/services/deadline.service';
import { ActiveAssignmentService } from '../../../core/services/active-assignment.service';
import { ActiveAssignment } from '../../../shared/models/activeAssignment.model';
import { CommonModule } from '@angular/common';
import { AuthorizationService } from '../../../core/services/authorization.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ActiveAssignmentRoutingService } from '../../../core/services/active-assignment-routing.service';
import { Router } from '@angular/router';
import { toZonedTime } from 'date-fns-tz';
import { CalendarComponent } from '../../../shared/components/calendar/calendar.component';
import {DeadlineCreateComponent} from '../deadline-create/deadline-create.component';
import {ConfirmationModalComponent} from '../../../shared/components/confirmation-modal/confirmation-modal.component';

@Component({
    selector: 'app-deadline-overview',
    imports: [
        CommonModule,
        ButtonComponent,
        CalendarComponent,
        DeadlineCreateComponent,
        ConfirmationModalComponent
    ],
    templateUrl: './deadline-overview.component.html',
    styleUrls: ['./deadline-overview.component.scss']
})
export class DeadlineOverviewComponent implements OnInit, OnDestroy {

    private readonly deadlineService: DeadlineService = inject(DeadlineService);
    private readonly activeAssignmentService: ActiveAssignmentService = inject(ActiveAssignmentService);
    private readonly authorizationService: AuthorizationService = inject(AuthorizationService);
    private readonly activeAssignmentRoutingService = inject(ActiveAssignmentRoutingService);
    private readonly router: Router = inject(Router);

    public isTeacher$: Observable<boolean> = this.authorizationService.isTeacher$();

    deadlines$: Observable<Deadline[]> | null = null;
    activeAssignment: ActiveAssignment | null = this.activeAssignmentService.getActiveAssignment();

    private activeAssignmentSub?: Subscription;

    // For delete modal (already implemented)
    selectedDeadline: Deadline | null = null;
    showModal = false;

    // New property for create deadline modal
    showCreateModal = false;

    selectedDate: Date | null = null;

    onDayClick(date: Date) {
        this.selectedDate = date;
        this.openCreateModal();
    }

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

    // Open the create deadline modal overlay
    openCreateModal(): void {
        this.showCreateModal = true;
    }

    // Close the create deadline modal overlay
    closeCreateModal(): void {
        this.showCreateModal = false;
        this.selectedDate = null;
    }

    // Handle the event when a deadline is successfully created:
    onDeadlineCreated(): void {
        this.loadDeadlinesForAssignment();
        this.closeCreateModal();
    }

    // Existing delete modal methods
    openDeleteModal(deadline: Deadline): void {
        this.selectedDeadline = deadline;
        this.showModal = true;
    }
    closeModal(): void {
        this.showModal = false;
        this.selectedDeadline = null;
    }
    confirmDelete(): void {
        if (this.selectedDeadline) {
            this.deadlineService.deleteDeadline(this.selectedDeadline.id).subscribe(() => {
                this.loadDeadlinesForAssignment();
                this.closeModal();
            });
        }
    }

    convertToTimeZone(date: string): Date {
        const dateObj = new Date(date + 'Z');
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return toZonedTime(dateObj, timeZone);
    }
}
