import { Component, Input, Output, EventEmitter } from '@angular/core';

import {ButtonComponent} from '../button/button.component';

@Component({
    selector: 'app-confirmation-modal',
    standalone: true,
    imports: [
    ButtonComponent
],
    templateUrl: './confirmation-modal.component.html',
    styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {
    /** Title to display on the modal */
    @Input() title: string = 'Confirm';
    /** The confirmation message */
    @Input() message: string = 'Are you sure?';
    /** Text for the confirm button */
    @Input() confirmText: string = 'Confirm';
    /** Text for the cancel button */
    @Input() cancelText: string = 'Cancel';

    /** Emitted when the user confirms */
    @Output() confirm = new EventEmitter<void>();
    /** Emitted when the user cancels */
    @Output() cancel = new EventEmitter<void>();

    /** Internal flag to disable buttons to prevent multiple clicks */
    isProcessing: boolean = false;

    onConfirm(): void {
        if (!this.isProcessing) {
            this.isProcessing = true;
            this.confirm.emit();
        }
    }

    onCancel(): void {
        if (!this.isProcessing) {
            this.isProcessing = true;
            this.cancel.emit();
        }
    }
}
