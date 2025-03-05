import { Directive, HostListener, Input, Output, EventEmitter } from '@angular/core';
import {ConfirmationOptions, ConfirmModalService} from '../../core/services/ConfirmModal.service';


@Directive({
    selector: '[appConfirmClick]'
})
export class ConfirmClickDirective {
    @Input() confirmTitle: string = 'Confirm';
    @Input() confirmMessage: string = 'Are you sure?';
    @Input() confirmText: string = 'Yes';
    @Input() cancelText: string = 'Cancel';

    @Output() confirmedClick = new EventEmitter<void>();

    constructor(private confirmModalService: ConfirmModalService) {}

    @HostListener('click')
    onClick(): void {
        const options: ConfirmationOptions = {
            title: this.confirmTitle,
            message: this.confirmMessage,
            confirmText: this.confirmText,
            cancelText: this.cancelText
        };

        this.confirmModalService.open(options).subscribe((confirmed: boolean) => {
            if (confirmed) {
                this.confirmedClick.emit();
            }
        });
    }
}
