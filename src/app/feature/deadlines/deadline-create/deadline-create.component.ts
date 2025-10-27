import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    ValidatorFn,
    Validators
} from '@angular/forms';
import { DeadlineService } from '../../../core/services/deadline.service';
import { ActiveAssignmentService } from '../../../core/services/active-assignment.service';
import { Subscription } from 'rxjs';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ToastService } from '../../../core/services/toast.service';
import { DeadlineRestrictionEnum } from '../../../shared/models/DeadlineRestriction.enum';
import { Deadline } from '../../../shared/models/deadline.model';
import { EnumDisplayPipe } from '../../../shared/pipes/enum-display.pipe';

export const futureDateValidator: ValidatorFn = (control: AbstractControl) => {
    const value = control.value;
    if (!value) return null;
    const selectedDate = new Date(value);
    const currentDate = new Date();
    return selectedDate <= currentDate ? { futureDate: true } : null;
};

@Component({
    selector: 'app-deadline-create',
    imports: [ReactiveFormsModule, ButtonComponent, EnumDisplayPipe],
    templateUrl: './deadline-create.component.html',
    styleUrls: ['./deadline-create.component.scss']
})
export class DeadlineCreateComponent implements OnInit, OnDestroy {
    private readonly deadlineService: DeadlineService = inject(DeadlineService);
    private readonly activeAssignmentService: ActiveAssignmentService = inject(ActiveAssignmentService);
    private readonly toastService: ToastService = inject(ToastService);

    @Output() closeModal = new EventEmitter<void>();
    @Output() deadlineCreated = new EventEmitter<void>();
    @Input() defaultDate: Date | null = null;

    deadlineRestrictions = Object.values(DeadlineRestrictionEnum);

    deadlineForm: FormGroup = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
        description: new FormControl(''),
        dueDate: new FormControl('', [Validators.required, futureDateValidator]),
        restriction: new FormControl(DeadlineRestrictionEnum.NONE, [Validators.required]),
        timeZone: new FormControl('', [Validators.required])
    });

    private subscriptions: Subscription[] = [];

    ngOnInit() {
        const baseDate = this.defaultDate ? new Date(this.defaultDate) : new Date();
        baseDate.setHours(9, 0, 0, 0);

        const year = baseDate.getFullYear();
        const month = String(baseDate.getMonth() + 1).padStart(2, '0');
        const day = String(baseDate.getDate()).padStart(2, '0');
        const hours = String(baseDate.getHours()).padStart(2, '0');
        const minutes = String(baseDate.getMinutes()).padStart(2, '0');

        const localString = `${year}-${month}-${day}T${hours}:${minutes}`;

        this.deadlineForm.patchValue({
            dueDate: localString,
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
