import {Component, EventEmitter, inject, Output} from '@angular/core';
import {CourseService} from '../../../core/services/course.service';
import {AuthFacade} from '../../../auth/store/auth.facade';
import {Observable, switchMap} from 'rxjs';
import {Course} from '../../../shared/models/course.model';
import {map} from 'rxjs/operators';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-create-course',
  imports: [
    CommonModule,
  ],
  templateUrl: './create-course.component.html',
  styleUrl: './create-course.component.scss'
})
export class CreateCourseComponent {
  @Output() closeModal = new EventEmitter<void>();
  private courseService = inject(CourseService);
  private authFacade = inject(AuthFacade);

  courses$: Observable<Course[]> | null = null;
  selectedCourse: Course | null = null;

  ngOnInit() {
    this.courses$ = this.authFacade.user$.pipe(
      map(user => user?.role || 'teacher'), // Default to 'STUDENT' if role is undefined
      switchMap(role => this.courseService.getCanvasCourses(role)),
    );

    //log the courses
    this.courses$.subscribe(courses => console.log(courses));
  }

  selectCourse(course: Course) {
    this.selectedCourse = course;
  }

  close() {
    this.closeModal.emit();
  }
}
