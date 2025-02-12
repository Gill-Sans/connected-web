import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {Assignment} from '../../../shared/models/assignment.model';
import {AssignmentService} from '../../../core/services/assignment.service';
import {Observable} from 'rxjs';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-assignment-create',
    imports: [CommonModule],
    templateUrl: './assignment-create.component.html',
    styleUrl: './assignment-create.component.scss'
})
export class AssignmentCreateComponent implements OnInit {
    @Input() courseId!: number;
    @Output() closeModal = new EventEmitter<void>();
    @Output() assignmentImported = new EventEmitter<Assignment>();

    private assignmentService = inject(AssignmentService);

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

        this.isLoading = true;
        this.successMessage = null;
        this.errorMessage = null;
        this.selectedAssignment.courseId = this.courseId;
        this.selectedAssignment.canvasAssignmentId = this.selectedAssignment.id;
        this.selectedAssignment.defaultTeamSize = 3;

        this.assignmentService.createAssignment(this.selectedAssignment).subscribe({


            next: (response) => {
                this.successMessage = 'Assignment successfully created';
                this.isLoading = false;

                this.assignmentImported.emit(this.selectedAssignment ?? undefined);

                setTimeout(() => this.successMessage = null, 3000);

                setTimeout(() => this.close(), 2000);
            },
            error: (err) => {
                console.error('Error creating course:', err);

                this.errorMessage = 'x Failed to create course!';
                this.isLoading = false;

                setTimeout(() => this.errorMessage = null, 3000);
            }
        })
    }

    close() {
        this.closeModal.emit();
    }
}
