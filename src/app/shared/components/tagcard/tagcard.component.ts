import {Component, EventEmitter, Input, Output} from '@angular/core';
import {tag} from '../../models/tag.model';

import {FormsModule} from '@angular/forms';

@Component({
    selector: 'app-tagcard',
    imports: [FormsModule],
    templateUrl: './tagcard.component.html',
    styleUrl: './tagcard.component.scss'
})
export class TagcardComponent {
    @Input() tag!: tag;
    @Input() showDelete: boolean = false;
    @Output() deleteTag = new EventEmitter<number>();

    onDelete() {
        this.deleteTag.emit(this.tag.id);
    }
}
