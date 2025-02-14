import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {Assignment} from '../../../shared/models/assignment.model';
import {AssignmentService} from '../../../core/services/assignment.service';
import {Observable} from 'rxjs';
import {CommonModule} from '@angular/common';
import {ToastService} from '../../../core/services/toast.service';

@Component({
    selector: 'app-assignment-create',
    imports: [CommonModule],
    templateUrl: './assignment-create.component.html',
    styleUrl: './assignment-create.component.scss'
})
export class AssignmentCreateComponent implements OnInit {
    @Input() courseId!: number;
    @Output() closeModal = new EventEmitter<void>();
    // Rename this output to match what the parent expects:
    @Output() assignmentCreated = new EventEmitter<Assignment>();

    private assignmentService = inject(AssignmentService);
    private toastService = inject(ToastService);

    assignments$: Observable<Assignment[]> | null = null;
    selectedAssignment: Assignment | null = null;
    isLoading = false;
    successMessage: string | null = null;
    errorMessage: string | null = null;

    ngOnInit() {
        if (!this.courseId) {
            console.error("No courseId provided!");
            return;
        }

        this.assignments$ = this.assignmentService.getCanvasAssignments(this.courseId);
    }

    selectAssignment(assignment: Assignment) {
        this.selectedAssignment = assignment;
    }

    createAssignment() {
        if (!this.selectedAssignment) return;

        // Prepare the assignment for creation.
        this.selectedAssignment.courseId = this.courseId;
        this.selectedAssignment.canvasAssignmentId = this.selectedAssignment.id;
        this.selectedAssignment.defaultTeamSize = 3;

        this.assignmentService.createAssignment(this.selectedAssignment).subscribe({
            next: (response) => {
                this.assignmentCreated.emit(this.selectedAssignment!);
                this.close();
                this.toastService.showToast('success', 'Assignment created successfully!');
            },
            error: (err) => {
                this.toastService.showToast('error', 'Failed to create assignment!');
            }
        });
    }

    close() {
        this.closeModal.emit();
    }
}
