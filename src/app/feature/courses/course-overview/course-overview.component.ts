import {Component, inject, OnInit} from '@angular/core';
import {ButtonComponent} from '../../../shared/components/button/button.component';
import {CommonModule} from '@angular/common';
import {CourseCreateComponent} from '../course-create/course-create.component';
import {CourseService} from '../../../core/services/course.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {Course} from '../../../shared/models/course.model';
import {AssignmentCreateComponent} from '../../assignments/assignment-create/assignment-create.component';

@Component({
    selector: 'app-course-overview',
    imports: [
        CommonModule,
        ButtonComponent,
        CourseCreateComponent,
        AssignmentCreateComponent
    ],
    templateUrl: './course-overview.component.html',
    styleUrl: './course-overview.component.scss'
})
export class CourseOverviewComponent implements OnInit {
    private courseService = inject(CourseService);
    private coursesSubject = new BehaviorSubject<Course[]>([]);
    courses$: Observable<Course[]> = this.coursesSubject.asObservable();

    selectedCourseId: number | null = null;
    showImportCourseModal = false;
    showImportAssignmentModal = false;

    ngOnInit() {
        this.loadCourses();
    }

    loadCourses() {
        this.courseService.getAllCourses().subscribe(courses => {
            console.log("🔄 Updating courses list:", courses);
            this.coursesSubject.next(courses);
        });
    }

    onCourseCreated(newCourse: Course) {
        this.loadCourses();
        this.showImportCourseModal = false;
    }

    onAssignmentCreated() {
        this.loadCourses();
        this.showImportAssignmentModal = false;
    }

    openModal() {
        this.showImportCourseModal = true;
    }

    openAssignmentImportModal(course: Course) {
        this.selectedCourseId = course.id;
        this.showImportAssignmentModal = true;
    }
}
