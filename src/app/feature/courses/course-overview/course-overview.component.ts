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
  assignments = [
    {name: 'verymega insanely long assignment because ow yeah i am a good teacher wow very cool i dunno man more text to implement in them becausedamn 1', dueDate: '2020-01-01', description: 'This is the first assignment'},
    {name: 'A medium long title for an assignment because wow 2', dueDate: '2020-01-02', description: 'This is the second second second  second second second  second second second  second second second  second second second  second second second  second second second  second second second  assignment'},
    {name: 'Just a normal assignment name 3', dueDate: '2020-01-03', description: 'This is theassignmentassignment is is is is is isis is  third assignment assignment assignment  vassignment assignment assignment assignment assignment'},
    {name: 'Machine Learning coding assignment 1st term 4', dueDate: '2020-01-04', description: 'This is the fourth assignment'},
    {name: 'Assignment 3 - CIA triad and Parkerian Hexad - Case Study Analysis ', dueDate: '2020-01-05', description: 'This is the fifth assignment'},
  ]

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

  importAssignment() {
    console.log('importing assignment');
  }
}
