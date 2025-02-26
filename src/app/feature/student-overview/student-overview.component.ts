import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ActiveAssignmentService} from '../../core/services/active-assignment.service';
import {Observable, Subscription} from 'rxjs';
import {User} from '../../auth/models/user.model';
import {CourseService} from '../../core/services/course.service';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-student-overview',
    imports: [CommonModule],
    templateUrl: './student-overview.component.html',
    styleUrl: './student-overview.component.scss'
})
export class StudentOverviewComponent implements OnInit, OnDestroy {

    private readonly activeAssignmentService: ActiveAssignmentService = inject(ActiveAssignmentService);
    private readonly courseService: CourseService = inject(CourseService);
    public activeAssignment$ = this.activeAssignmentService.activeAssignment$;
    students$: Observable<User[]> | null = null;
    private subscriptions: Subscription[] = [];

    ngOnInit(): void {
        const activeAssignmentSubscription = this.activeAssignment$.subscribe(activeAssignment => {
            this.loadStudents();
        });
        this.subscriptions.push(activeAssignmentSubscription);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    private loadStudents() {
        const courseId = this.activeAssignmentService.getActiveAssignment()?.course.id;
        if (courseId) {
            this.students$ = this.courseService.getAllEnrolledStudentsByCourseId(courseId.toString());
        }
    }
}
