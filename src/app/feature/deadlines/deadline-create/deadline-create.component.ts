import { Component, EventEmitter, inject, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators, ValidatorFn } from '@angular/forms';
import { DeadlineService } from '../../../core/services/deadline.service';
import { ActiveAssignmentService } from '../../../core/services/active-assignment.service';
import { ActiveAssignmentRoutingService } from '../../../core/services/active-assignment-routing.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ToastService } from '../../../core/services/toast.service';
import { DeadlineRestrictionEnum } from '../../../shared/models/DeadlineRestriction.enum';
import { Deadline } from '../../../shared/models/deadline.model';
import { EnumDisplayPipe } from '../../../shared/pipes/enum-display.pipe';

// Custom validator to ensure the due date is in the future.
export const futureDateValidator: ValidatorFn = (control: AbstractControl) => {
    const value = control.value;
    if (!value) return null;
    const selectedDate = new Date(value);
    const currentDate = new Date();
    // If selected date is less than or equal to the current date, return an error.
    return selectedDate <= currentDate ? { futureDate: true } : null;
};

@Component({
    selector: 'app-deadline-create',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonComponent,
        EnumDisplayPipe
    ],
    templateUrl: './deadline-create.component.html',
    styleUrls: ['./deadline-create.component.scss']
})
export class DeadlineCreateComponent implements OnDestroy {
    private readonly deadlineService: DeadlineService = inject(DeadlineService);
    private readonly activeAssignmentService: ActiveAssignmentService = inject(ActiveAssignmentService);
    private readonly activeAssignmentRoutingService: ActiveAssignmentRoutingService = inject(ActiveAssignmentRoutingService);
    private readonly router: Router = inject(Router);
    private readonly toastService: ToastService = inject(ToastService);

    @Output() closeModal = new EventEmitter<void>();
    @Output() deadlineCreated = new EventEmitter<void>();

    deadlineRestrictions = Object.values(DeadlineRestrictionEnum);

    deadlineForm: FormGroup = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
        description: new FormControl(''),
        dueDate: new FormControl(new Date().toISOString().slice(0, 16), [Validators.required, futureDateValidator]),
        restriction: new FormControl(DeadlineRestrictionEnum.NONE, [Validators.required]),
        timeZone: new FormControl('', [Validators.required])
    });

    private subscriptions: Subscription[] = [];

    constructor() {
        const now = new Date();
        const localISOTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
        this.deadlineForm.patchValue({
            dueDate: localISOTime,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
    }

    onSubmit() {
        if (this.deadlineForm.valid) {
            const assignmentId = this.activeAssignmentService.getActiveAssignment()?.assignment.id;
            if (assignmentId) {
                const deadline: Deadline = this.deadlineForm.value as Deadline;
                const createSub = this.deadlineService.createDeadline(assignmentId, deadline).subscribe({
                    next: () => {
                        this.toastService.showToast('success', 'Deadline created');
                        // Instead of navigating away, emit an event to notify parent component
                        this.deadlineCreated.emit();
                    },
                    error: () => {
                        this.toastService.showToast('error', 'Error creating deadline');
                    }
                });
                this.subscriptions.push(createSub);
            }
        } else {
            this.toastService.showToast('error', 'Please fill out all required fields.');
            this.deadlineForm.markAllAsTouched();
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
