import { Component, inject, OnInit } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CommonModule } from '@angular/common';
import { CourseCreateComponent } from '../course-create/course-create.component';
import { CourseService } from '../../../core/services/course.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Course } from '../../../shared/models/course.model';
import { AssignmentCreateComponent } from '../../assignments/assignment-create/assignment-create.component';
import { AssignmentService } from '../../../core/services/assignment.service';
import { Assignment } from '../../../shared/models/assignment.model';

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
  private assignmentService = inject(AssignmentService);
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  private assignmentsSubject = new BehaviorSubject<Assignment[]>([]);
  courses$: Observable<Course[]> = this.coursesSubject.asObservable();
  assignments$: Observable<Assignment[]> = this.assignmentsSubject.asObservable();

  selectedCourseId: number | null = null;
  showImportCourseModal = false;
  showImportAssignmentModal = false;

  ngOnInit() {
    this.loadCourses();
    this.loadAssignments();

    this.courses$.subscribe(courses => {
      console.log("Courses:", courses);
    });
    this.assignments$.subscribe(assignments => {
      console.log("Assignments:", assignments);
    });
  }

  loadCourses() {
    this.courseService.getAllCourses().subscribe(courses => {

      console.log("🔄 Updating courses list:", courses);
      this.coursesSubject.next(courses);
    });
  }

  loadAssignments() {
    if (this.selectedCourseId) {
      this.assignmentService.getAllAssignments(this.selectedCourseId).subscribe(assignments => {
        console.log("Updating assignments list: ", assignments);
        this.assignmentsSubject.next(assignments as Assignment[]);
      });
    }
  }

  onCourseCreated(newCourse: Course) {
    this.loadCourses();
    this.showImportCourseModal = false;
  }

  onAssignmentCreated() {
    this.loadAssignments();
    this.showImportAssignmentModal = false;
  }

  openModal() {
    this.showImportCourseModal = true;
  }

  openAssignmentImportModal(course: Course) {
    this.selectedCourseId = course.id;
    this.showImportAssignmentModal = true;
    this.loadAssignments();
  }
}
