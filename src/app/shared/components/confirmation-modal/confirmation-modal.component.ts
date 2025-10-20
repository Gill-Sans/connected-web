import {Component, Input, Output, EventEmitter, SimpleChanges} from '@angular/core';
import {ButtonComponent} from '../button/button.component';
import {FormsModule} from '@angular/forms';
import {NgClass} from '@angular/common';

@Component({
    selector: 'app-confirmation-modal',
    standalone: true,
    imports: [
        FormsModule,
        ButtonComponent,
        NgClass
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

    /** If set ('delete'), require the user to type this exact text to allow to confirm */
    @Input() exactConfirmText: string | null = null;

    /** Emitted when the user confirms */
    @Output() confirm = new EventEmitter<void>();
    /** Emitted when the user cancels */
    @Output() cancel = new EventEmitter<void>();

    /** Internal flag to disable buttons to prevent multiple clicks */
    isProcessing: boolean = false;

    /** Current value typed by the user when exactConfirmText is required */
    confirmInput: string = '';

    ngOnChanges(changes: SimpleChanges):void{
        // Reset typed input whenever requirement changes so UI stays consistent
        if(changes['exactConfirmText']) {
            this.confirmInput = '';
            this.isProcessing = false;
        }
    }

    get isInputInvalid(): boolean {
        return !!(
            this.exactConfirmText &&
            this.confirmInput.trim().length > 0 &&
            this.confirmInput.trim().toLowerCase() !== this.exactConfirmText.trim().toLowerCase()
        );
    }

    get isConfirmDisabled(): boolean {
        if(this.isProcessing){
            return true;
        }
        if(this.exactConfirmText && this.exactConfirmText.length > 0){
            return this.confirmInput.trim().toLowerCase()  !== this.exactConfirmText.trim().toLowerCase();
        }
        return false;
    }

    onConfirm(): void {
        if (!this.isConfirmDisabled) {
            this.isProcessing = true;
            this.confirm.emit();
        }
    }

    onCancel(): void {
        if (!this.isProcessing) {
            this.isProcessing = true;
            this.cancel.emit();
            this.confirmInput = '';
            this.isProcessing = false;
        }
    }
}
