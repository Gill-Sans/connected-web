import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CourseService } from '../../../core/services/course.service';
import { Observable } from 'rxjs';
import { Course } from '../../../shared/models/course.model';
import { AssignmentService } from '../../../core/services/assignment.service';
import {CanvasImportModalComponent} from '../../../shared/components/canvas-import-modal/canvas-import-modal.component';
import {Assignment} from '../../../shared/models/assignment.model';
import {ConfirmationModalComponent} from '../../../shared/components/confirmation-modal/confirmation-modal.component';

@Component({
    selector: 'app-course-overview',
    standalone: true,
    imports: [
        CommonModule,
        ButtonComponent,
        CanvasImportModalComponent,
        ConfirmationModalComponent
    ],
    templateUrl: './course-overview.component.html',
    styleUrls: ['./course-overview.component.scss']
})
export class CourseOverviewComponent implements OnInit {
    private courseService = inject(CourseService);
    private assignmentService = inject(AssignmentService);

    // courses$ already holds the Canvas courses (filtered in the backend)
    courses$: Observable<Course[]> = this.courseService.courses$;
    canvasCourses$: Observable<Course[]> = this.courseService.getCanvasCourses();
    assignmentItems$: Observable<Assignment[]> | null = null;

    // Flags to control the visibility of the modals.
    showImportCourseModal: boolean = false;
    showImportAssignmentModal: boolean = false;
    showCourseDeleteModal: boolean = false;
    showAssignmentModal: boolean = false;

    // When opening the assignment import modal, we pass the course ID directly.
    courseIdInput: number | null = null;

    ngOnInit(): void {
        this.courseService.refreshCourses();
    }

    openCourseImportModal(): void {
        this.showImportCourseModal = true;
    }

    closeCourseModal(): void {
        this.showImportCourseModal = false;
    }

    openAssignmentImportModal(courseId: number): void {
        this.courseIdInput = courseId;
        this.assignmentItems$ = this.assignmentService.getCanvasAssignments(courseId);
        this.showImportAssignmentModal = true;
    }

    closeAssignmentModal(): void {
        this.showImportAssignmentModal = false;
    }

    openCourseDeleteModal(courseId: number): void {
        this.courseIdInput = courseId;
        this.showCourseDeleteModal = true;
    }

    closeCourseDeleteModal():void {
        this.showCourseDeleteModal = false;
    }

    /**
     * Handles creation of a course.
     * @param course The course data returned from the modal.
     */
    handleCourseCreate(course: Course): void {
        this.courseService.createCourse(course)
            .subscribe({
                next: () => {
                    this.courseService.refreshCourses();
                    this.closeCourseModal();
                },
                error: (err) => console.error('Course creation error:', err)
            });
    }

    handleCourseDelete(courseId: number): void {
        this.courseService.deleteCourse(courseId)
            .subscribe({
                next: () => {
                    this.courseService.refreshCourses();
                    this.closeCourseDeleteModal();
                },
                error: (err) => console.error('Course delete error:', err)
            })
    }

    /**
     * Handles creation of an assignment.
     * @param data The data returned from the modal; expected format is
     *             { item: Assignment, defaultTeamSize: number }.
     */
    handleAssignmentCreate(data: any): void {
        this.assignmentService.createAssignment(data.item)
            .subscribe({
                next: () => {
                    this.courseService.refreshCourses();
                    this.closeAssignmentModal();
                },
                error: (err) => console.error('Assignment creation error:', err)
            });
    }
}
