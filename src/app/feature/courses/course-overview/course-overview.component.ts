import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/button/button.component';
import {CommonModule} from '@angular/common';
import {CreateCourseComponent} from '../create-course/create-course.component';

@Component({
  selector: 'app-course-overview',
  imports: [
    CommonModule,
    ButtonComponent,
    CreateCourseComponent
  ],
  templateUrl: './course-overview.component.html',
  styleUrl: './course-overview.component.scss'
})
export class CourseOverviewComponent {
  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
