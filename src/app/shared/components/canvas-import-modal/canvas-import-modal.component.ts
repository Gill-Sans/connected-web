import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {map, Observable} from 'rxjs';
import {Course} from '../../models/course.model';

interface GroupedCourses {
    yearLabel: string;
    courses: Course[];
}

@Component({
    selector: 'app-canvas-import-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './canvas-import-modal.component.html',
    styleUrls: ['./canvas-import-modal.component.scss']
})
export class CanvasImportModalComponent implements OnInit {
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

    ngOnInit() {
        if (this.type === 'course' && this.items$) {
            this.items$ = this.items$.pipe(
                map((courses: Course[]) => this.groupCoursesByAcademicYear(courses))
            );
        }
    }

    private groupCoursesByAcademicYear(courses: Course[]): GroupedCourses[] {
        const groups: { [key: string]: Course[] } = {};

        for (const course of courses) {
            const createdAt = new Date(course.canvasCreatedAt);
            const year = createdAt.getUTCFullYear();
            const yearLabel = `Year ${year}-${year + 1}`;

            if (!groups[yearLabel]) {
                groups[yearLabel] = [];
            }
            groups[yearLabel].push(course);
        }

        return Object.keys(groups)
            .sort((a, b) => b.localeCompare(a))
            .map(yearLabel => ({
                yearLabel,
                courses: groups[yearLabel]
            }));
    }

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
