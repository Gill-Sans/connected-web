import {Component, EventEmitter, inject, Output} from '@angular/core';
import {CourseService} from '../../../core/services/course.service';
import {AuthFacade} from '../../../auth/store/auth.facade';
import {Observable, switchMap} from 'rxjs';
import {Course} from '../../../shared/models/course.model';
import {map, tap} from 'rxjs/operators';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-course-create',
  imports: [
    CommonModule,
  ],
  templateUrl: './create-course.component.html',
  styleUrl: './course-create.component.scss'
})
export class CourseCreateComponent {
  @Output() closeModal = new EventEmitter<void>();
  private courseService = inject(CourseService);
  private authFacade = inject(AuthFacade);

  courses$: Observable<Course[]> | null = null;
  selectedCourse: Course | null = null;
  isLoading = false; // To prevent multiple clicks
  successMessage: string | null = null;
  errorMessage: string | null = null;

  ngOnInit() {
    this.courses$ = this.authFacade.user$.pipe(
      map(user => user?.role || 'teacher'),
      switchMap(role => this.courseService.getCanvasCourses(role)),
      tap(courses => { console.log('Courses:', courses); })
    );
  }

  selectCourse(course: Course) {
    this.selectedCourse = course;
  }

  createCourse() {
    if (!this.selectedCourse) return;
    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    this.courseService.createCourse(this.selectedCourse).subscribe({
      next: (response) => {
        console.log('Course created:', response);
        this.successMessage = 'Course successfully created!';
        this.isLoading = false;
        setTimeout(() => this.close(), 2000); // Close modal after 2s
      },
      error: (err) => {
        console.error('Error creating course:', err);
        this.errorMessage = 'Failed to create course!';
        this.isLoading = false;
      }
    });
  }

  close() {
    this.closeModal.emit();
  }
}
