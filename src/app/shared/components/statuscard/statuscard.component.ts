import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ApplicationStatusEnum } from '../../models/ApplicationStatus.enum';

@Component({
  selector: 'app-statuscard',
  imports: [CommonModule],
  templateUrl: './statuscard.component.html',
  styleUrl: './statuscard.component.scss'
})
export class StatuscardComponent {
  @Input() status!: ApplicationStatusEnum;
  getStatusClass(): string {
    return this.status.toString().toLowerCase();
  }
}
