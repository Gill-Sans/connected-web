import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { EnumDisplayPipe } from '../../pipes/enum-display.pipe';

@Component({
    selector: 'app-statuscard',
    imports: [CommonModule, EnumDisplayPipe],
    templateUrl: './statuscard.component.html',
    styleUrl: './statuscard.component.scss'
})
export class StatuscardComponent {
    @Input() status!: string;
    // New input for the variant, defaulting to 'large'
    @Input() variant: 'large' | 'small' = 'large';

    // Helper to get the base status class (e.g., 'pending')
    getStatusClass(): string {
        return this.status.toLowerCase().replace(/\s/g, '-');
    }
}
