import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-statuscard',
  imports: [CommonModule],
  templateUrl: './statuscard.component.html',
  styleUrl: './statuscard.component.scss'
})
export class StatuscardComponent {
  @Input() status: string= '';
  
  getStatusClass(): string {
    switch (this.status.toLowerCase()) {
      case 'approved':
        return 'approved';
      case 'pending':
        return 'pending';
      case 'rejected':
        return 'rejected';
      default:
        return 'default';
    }
  }
}
