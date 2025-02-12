import {CommonModule} from '@angular/common';
import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-conversationcard',
    imports: [CommonModule],
    templateUrl: './conversationcard.component.html',
    styleUrl: './conversationcard.component.scss'
})
export class ConversationcardComponent {
    @Input() first_name!: string; // First name of the user
    @Input() last_name!: string; // Last
    @Input() fullname: string = this.first_name + " " + this.last_name; // Full name of the user
    @Input() timeStamp!: string; // Time of the message
    @Input() message!: string; // Message content

}
