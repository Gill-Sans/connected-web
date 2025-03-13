import { CommonModule } from '@angular/common';
import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-button',
    imports: [CommonModule],
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
    /**
     * Native button type attribute:
     * 'button' for standard buttons,
     * 'submit' for form submissions,
     * 'reset' to reset forms.
     */
    @Input('type') buttonType: 'button' | 'submit' | 'reset' = 'button';

    /**
     * The variant determines the color and style.
     * 'primary' (purple) for positive/confirm actions,
     * 'danger' (red) for cancel/negative actions,
     * 'neutral' (gray) for neutral actions,
     * 'success' (green) for successful outcomes.
     */
    @Input() variant: 'primary' | 'danger' | 'neutral' | 'success' | 'link' = 'primary';

    /** Disable the button if true */
    @Input() disabled: boolean = false;

    /**
     * Optional icon URL. If provided, the icon will appear before the button content.
     * Alternatively, use content projection to insert a custom icon.
     */
    @Input() icon: string | null = null;


    @Output('click') buttonClick = new EventEmitter<void>();

    onClick(event: Event) {
        event.stopPropagation(); // Prevent bubbling to app-button
        if (!this.disabled) {
            this.buttonClick.emit();
        }
    }
}
