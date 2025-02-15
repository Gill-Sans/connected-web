import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-conversationcard',
    imports: [CommonModule],
    templateUrl: './conversationcard.component.html',
    styleUrl: './conversationcard.component.scss'
})
export class ConversationcardComponent {
    @Input() firstName!: string;
    @Input() lastName!: string;
    @Input() createdAt!: Date;
    @Input() comment!: string;

}
