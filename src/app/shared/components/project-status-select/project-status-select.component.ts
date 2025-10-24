
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {ProjectStatusEnum} from '../../models/ProjectStatus.enum';

@Component({
    selector: 'app-project-status-select',
    imports: [FormsModule],
    templateUrl: './project-status-select.component.html',
    styleUrls: ['./project-status-select.component.scss']
})
export class ProjectStatusSelectComponent {
    /** Current value of the status */
    @Input() value!: ProjectStatusEnum;

    /** Disabled state for the select */
    @Input() disabled = false;

    /** Emit changes when a new status is selected */
    @Output() valueChange = new EventEmitter<ProjectStatusEnum>();

    /** All available statuses from the enum */
    projectStatusOptions = Object.values(ProjectStatusEnum);

    /** Optional: human-friendly labels */
    statusLabels: Record<ProjectStatusEnum, string> = {
        [ProjectStatusEnum.PENDING]: 'Pending',
        [ProjectStatusEnum.NEEDS_REVISION]: 'Needs Revision',
        [ProjectStatusEnum.REVISED]: 'Revised',
        [ProjectStatusEnum.APPROVED]: 'Approved',
        [ProjectStatusEnum.PUBLISHED]: 'Published',
        [ProjectStatusEnum.REJECTED]: 'Rejected',
    };

    onChange(newValue: ProjectStatusEnum) {
        if (newValue !== this.value) {
            this.value = newValue;
            this.valueChange.emit(newValue);
        }
    }

    trackByStatus = (_: number, status: ProjectStatusEnum) => status;
}
