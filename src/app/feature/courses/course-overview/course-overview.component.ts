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
    showAssignmentDeleteModal: boolean = false;
    showRefreshEnrollmentModal: boolean = false;

    isRefreshing: Record<number, boolean> = {};

    // When opening the assignment import modal, we pass the course ID directly.
    assignmentIdInput: number | null = null;
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

    openRefreshEnrollmentModal(courseId: number): void {
        this.courseIdInput = courseId;
        this.showRefreshEnrollmentModal = true;
    }

    closeRefreshEnrollmentModal(): void {
        this.showRefreshEnrollmentModal = false;
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

    openAssignmentDeleteModal(assignmentId: number): void {
        this.assignmentIdInput = assignmentId;
        this.showAssignmentDeleteModal = true;
    }

    closeAssignmentDeleteModal(): void {
        this.showAssignmentDeleteModal = false;
    }

    handleAssignmentDelete(assignmentId: number):void {
        this.assignmentService.deleteAssignment(assignmentId)
            .subscribe({
                next: () => {
                    this.courseService.refreshCourses();
                    this.closeAssignmentDeleteModal();
                },
                error: (err) => console.error('Assignment delete error:', err)
            })
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

    handleEnrollmentsRefresh(courseId: number): void {
        this.isRefreshing[courseId] = true;

        this.courseService.refreshEnrollments(courseId).subscribe({
            next: () => {
                this.isRefreshing[courseId] = false;
            },
            error: (err) => {
                console.error('Refresh enrollments error:', err);
                this.isRefreshing[courseId] = false;
            }
        });
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
