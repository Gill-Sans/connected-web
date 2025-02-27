import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Deadline} from '../../shared/models/deadline.model';
import {Observable, Subscription} from 'rxjs';
import {DeadlineService} from '../../core/services/deadline.service';
import {ActiveAssignmentService} from '../../core/services/active-assignment.service';
import {ActiveAssignment} from '../../shared/models/activeAssignment.model';
import {CommonModule} from '@angular/common';
import {AuthorizationService} from '../../core/services/authorization.service';
import {ButtonComponent} from '../../shared/components/button/button.component';
import {ActiveAssignmentRoutingService} from '../../core/services/active-assignment-routing.service';
import {Router} from '@angular/router';
import {toZonedTime} from 'date-fns-tz';
import {CalendarComponent} from '../../shared/components/calendar/calendar.component';

@Component({
    selector: 'app-deadline-overview',
    imports: [CommonModule, ButtonComponent, CalendarComponent],
    templateUrl: './deadline-overview.component.html',
    styleUrl: './deadline-overview.component.scss'
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

    selectedDeadline: Deadline | null = null;
    showModal = false;

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

    navigateToDeadlineCreate() {
        const builtRoute = this.activeAssignmentRoutingService.buildRoute('deadlines', 'create');
        this.router.navigate(builtRoute);
    }

    convertToTimeZone(date: string): Date {
        const dateObj = new Date(date + 'Z');
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return toZonedTime(dateObj, timeZone);
    }

    openDeleteModal(deadline: Deadline){
        this.selectedDeadline = deadline;
        this.showModal = true;
    }
    closeModal(){
        this.showModal = false;
        this.selectedDeadline = null;
    }

    confirmDelete(){
        if(this.selectedDeadline){
            this.deadlineService.deleteDeadline(this.selectedDeadline.id).subscribe(() => {
                this.loadDeadlinesForAssignment();
                this.closeModal();
            })
        }
    }
}
