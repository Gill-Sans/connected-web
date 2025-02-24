import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';

@Component({
    selector: 'app-conversationcard',
    imports: [CommonModule, FormsModule],
    templateUrl: './conversationcard.component.html',
    styleUrl: './conversationcard.component.scss'
})
export class ConversationcardComponent {
    @Input() firstName!: string;
    @Input() lastName!: string;
    @Input() createdAt!: Date;
    @Input() comment!: string;
    @Input() feedbackId!: number;
    @Input() isEditing: boolean = false;
    @Input() showEditDelete: boolean = false;

    @Output() edit = new EventEmitter<void>();
    @Output() delete = new EventEmitter<void>();
    @Output() confirmEdit = new EventEmitter<{ id: number; comment: string }>();
    @Output() cancelEdit = new EventEmitter<number>();

    editedComment: string = '';

    ngOnInit() {
        this.editedComment = this.comment;
    }

    onEdit() {
        this.edit.emit();
    }

    onDelete() {
        this.delete.emit();
    }

    onConfirm() {
        this.confirmEdit.emit({ id: this.feedbackId, comment: this.editedComment });
    }

    onCancel() {
        this.cancelEdit.emit(this.feedbackId);
    }
}
