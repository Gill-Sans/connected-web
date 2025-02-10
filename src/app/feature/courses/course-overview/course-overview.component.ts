import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import {CommonModule} from '@angular/common';
import {CourseCreateComponent} from '../course-create/course-create.component';

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
export class CourseOverviewComponent {
  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
