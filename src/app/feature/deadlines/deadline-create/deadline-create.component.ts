import { Component, inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DeadlineRestrictionEnum } from '../../../shared/models/DeadlineRestriction.enum';
import { Deadline } from '../../../shared/models/deadline.model';
import { ActiveAssignmentService } from '../../../core/services/active-assignment.service';
import { ActiveAssignmentRoutingService } from '../../../core/services/active-assignment-routing.service';
import { Router } from '@angular/router';
import { DeadlineService } from '../../../core/services/deadline.service';
import {ToastService} from '../../../core/services/toast.service';
import {ButtonComponent} from '../../../shared/components/button/button.component';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-deadline-create',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonComponent
    ],
    templateUrl: './deadline-create.component.html',
    styleUrl: './deadline-create.component.scss'
})
export class DeadlineCreateComponent implements OnDestroy {

    private readonly deadlineService: DeadlineService = inject(DeadlineService);
    private readonly activeAssignmentService: ActiveAssignmentService = inject(ActiveAssignmentService);
    private readonly activeAssignmentRoutingService: ActiveAssignmentRoutingService = inject(ActiveAssignmentRoutingService);
    private readonly router: Router = inject(Router);
    private readonly ToastService: ToastService = inject(ToastService);

    deadlineRestrictions = Object.values(DeadlineRestrictionEnum);

    deadlineForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
        description: new FormControl(''),
        dueDate: new FormControl(new Date().toISOString().slice(0, 16), [Validators.required]),
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
                let deadline: Deadline = this.deadlineForm.value as Deadline;

                const createSub = this.deadlineService.createDeadline(assignmentId, deadline).subscribe(deadline => {
                    this.router.navigate(this.activeAssignmentRoutingService.buildRoute('deadlines'));
                    this.ToastService.showToast('success', 'Deadline created');
                });
                this.subscriptions.push(createSub);
            }
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
