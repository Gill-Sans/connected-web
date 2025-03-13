import {Component, inject, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {ActiveAssignmentRoutingService} from '../../../core/services/active-assignment-routing.service';
import {MarkdownModule} from 'ngx-markdown';
import {Project} from '../../models/project.model';
import {TagcardComponent} from '../tagcard/tagcard.component';
import {Role} from '../../../auth/models/role.model';

@Component({
    selector: 'app-projectcard',
    imports: [CommonModule, RouterModule, MarkdownModule,TagcardComponent],
    templateUrl: './projectcard.component.html',
    styleUrl: './projectcard.component.scss'
})
export class ProjectcardComponent {
    @Input() project!: Project;

    router: Router = inject(Router);
    private readonly assignmentRouting: ActiveAssignmentRoutingService = inject(ActiveAssignmentRoutingService);

    navigateToProject() {
        if (this.project.createdBy.role === Role.Researcher && this.project.assignmentId == null) {
            this.router.navigate(['projects', this.project.id.toString()]);
        }
        this.router.navigate(this.assignmentRouting.buildRoute('projects', this.project.id.toString()));
    }
}
