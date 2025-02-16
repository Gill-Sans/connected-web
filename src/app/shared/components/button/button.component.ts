import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-button',
    imports: [CommonModule],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss'
})
export class ButtonComponent {
    @Input() label: string = '';
    @Input() type: 'normal' | 'add' | 'post' | 'edit' | 'cancel' | 'back' | 'confirm' | 'Approve' | 'Reject' = 'normal';
    @Input() disabled: boolean = false;
}
