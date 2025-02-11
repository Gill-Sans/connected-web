import {Component, inject, OnInit} from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import {CommonModule} from '@angular/common';
import {CourseCreateComponent} from '../course-create/course-create.component';
import {log} from 'util';
import {CourseService} from '../../../core/services/course.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {Course} from '../../../shared/models/course.model';

@Component({
  selector: 'app-course-overview',
  imports: [
    CommonModule,
    ButtonComponent,
    CourseCreateComponent
  ],
  templateUrl: './course-overview.component.html',
  styleUrl: './course-overview.component.scss'
})
export class CourseOverviewComponent implements OnInit{
  private courseService = inject(CourseService);
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.coursesSubject.asObservable();

  showCreateModal = false;

  ngOnInit() {
    this.loadCourses();
    this.courses$.subscribe(courses => {
      console.log("Courses:", courses);
    });
  }

  loadCourses() {
    this.courseService.getAllCourses().subscribe(courses => {
      console.log("🔄 Updating courses list:", courses);
      this.coursesSubject.next(courses);
    });
  }

  onCourseCreated(newCourse: Course) {
    this.loadCourses();
    this.showCreateModal = false;
  }

  openModal() {
    this.showCreateModal = true;
  }
}
