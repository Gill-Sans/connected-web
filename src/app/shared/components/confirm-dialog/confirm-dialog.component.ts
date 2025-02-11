import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-confirm-dialog',
  imports: [CommonModule,ButtonComponent],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  @Input() title: string = "Are you sure?";
  @Input() message: string = "Do you really want to proceed?";
  @Output() confirm = new EventEmitter<void>(); // Gebruiker klikt "confirm"
  @Output() cancel = new EventEmitter<void>(); // Gebruiker klikt "Cancel"

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}