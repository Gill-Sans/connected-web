import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CourseService } from '../../../core/services/course.service';
import {Observable, Subscription} from 'rxjs';
import { Course } from '../../../shared/models/course.model';
import { AssignmentService } from '../../../core/services/assignment.service';
import {CanvasImportModalComponent} from '../../../shared/components/canvas-import-modal/canvas-import-modal.component';
import {Assignment} from '../../../shared/models/assignment.model';

@Component({
    selector: 'app-course-overview',
    standalone: true,
    imports: [
        CommonModule,
        ButtonComponent,
        CanvasImportModalComponent
    ],
    templateUrl: './course-overview.component.html',
    styleUrls: ['./course-overview.component.scss']
})
export class CourseOverviewComponent implements OnInit, OnDestroy {
    private courseService = inject(CourseService);
    private assignmentService = inject(AssignmentService);

    courses$: Observable<Course[]> = this.courseService.courses$;
    canvasCourses$: Observable<Course[]> = this.courseService.getCanvasCourses();
    assignmentItems$: Observable<Assignment[]> | null = null;

    showImportCourseModal: boolean = false;
    showImportAssignmentModal: boolean = false;
    courseIdInput: number | null = null;

    private subscriptions: Subscription[] = [];

    ngOnInit(): void {
        const refreshCoursesSubscription = this.courseService.refreshCourses().subscribe(() => {
        });
        this.subscriptions.push(refreshCoursesSubscription);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    openCourseImportModal(): void {
        this.showImportCourseModal = true;
    }

    closeCourseModal(): void {
        this.showImportCourseModal = false;
    }

    openAssignmentImportModal(courseId: number): void {
        this.courseIdInput = courseId;
        const assignmentItemsSubscription = this.assignmentService.getCanvasAssignments(courseId).subscribe(assignments => {
            this.assignmentItems$ = new Observable<Assignment[]>(observer => {
                observer.next(assignments);
                observer.complete();
            });
        });
        this.subscriptions.push(assignmentItemsSubscription);
        this.showImportAssignmentModal = true;
    }

    closeAssignmentModal(): void {
        this.showImportAssignmentModal = false;
    }

    handleCourseCreate(course: Course): void {
        const createCourseSubscription = this.courseService.createCourse(course)
            .subscribe({
                next: () => {
                    this.courseService.refreshCourses();
                    this.closeCourseModal();
                },
                error: (err) => console.error('Course creation error:', err)
            });
        this.subscriptions.push(createCourseSubscription);
    }

    handleAssignmentCreate(data: any): void {
        const createAssignmentSubscription = this.assignmentService.createAssignment(data.item)
            .subscribe({
                next: () => {
                    this.courseService.refreshCourses();
                    this.closeAssignmentModal();
                },
                error: (err) => console.error('Assignment creation error:', err)
            });
        this.subscriptions.push(createAssignmentSubscription);
    }
}
