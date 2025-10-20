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
    @Input() variant: 'large' | 'small' = 'large';
    @Input() type: 'static' | 'clickable' = 'static';
    @Input() active = false;

    // Helper to get the base status class (e.g., 'pending')
    getStatusClass(): string {
        return this.status.toLowerCase().replace(/\s/g, '-');
    }

    getClassList(): string[] {
        const classes = [this.getStatusClass(), this.type];
        if (this.active) {
            classes.push('active');
        }

        return classes;
    }
}
