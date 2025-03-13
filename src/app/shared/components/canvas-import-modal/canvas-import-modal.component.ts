import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-canvas-import-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './canvas-import-modal.component.html',
    styleUrls: ['./canvas-import-modal.component.scss']
})
export class CanvasImportModalComponent {
    /**
     * Type of the modal content.
     * 'course' – for importing courses.
     * 'assignment' – for importing assignments.
     */
    @Input() type: 'course' | 'assignment' = 'course';

    /**
     * Observable that emits the list of items (courses or assignments) to choose from.
     */
    @Input() items$: Observable<any[]> | null = null;

    /**
     * Optional courseId input for assignment import, if needed.
     */
    @Input() courseId: number | null = null;

    /**
     * Default team size (only applicable when type is 'assignment').
     */
    @Input() defaultTeamSize: number = 1;

    @Output() closeModal = new EventEmitter<void>();
    /**
     * Emitted when the user confirms creation.
     * For assignments, emits { item: Assignment, defaultTeamSize: number }.
     * For courses, emits the selected Course.
     */
    @Output() create = new EventEmitter<any>();

    selectedItem: any = null;
    isLoading: boolean = false;

    selectItem(item: any) {
        this.selectedItem = item;
    }

    onCreate() {
        if (this.isLoading || !this.selectedItem) {
            return;
        }
        this.isLoading = true;

        if (this.type === 'assignment') {
            this.selectedItem.defaultTeamSize = this.defaultTeamSize;
            this.create.emit({ item: this.selectedItem });
        } else {
            this.create.emit(this.selectedItem);
        }
    }

    close() {
        this.closeModal.emit();
    }
}
