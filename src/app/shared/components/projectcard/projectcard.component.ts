import {Component, inject, Input} from '@angular/core';
import {TagcardComponent} from '../tagcard/tagcard.component';
import {CommonModule} from '@angular/common';
import {tag} from '../../models/tag.model';
import {Router, RouterModule} from '@angular/router';
import {ActiveAssignmentRoutingService} from '../../../core/services/active-assignment-routing.service';
import { MarkdownModule } from 'ngx-markdown';
import {Project} from '../../models/project.model';

@Component({
    selector: 'app-projectcard',
    imports: [CommonModule, RouterModule, MarkdownModule],
    templateUrl: './projectcard.component.html',
    styleUrl: './projectcard.component.scss'
})
export class ProjectcardComponent {
    @Input() project!: Project;

    router: Router = inject(Router);
    private readonly assignmentRouting: ActiveAssignmentRoutingService = inject(ActiveAssignmentRoutingService);

    navigateToProject() {
        this.router.navigate(this.assignmentRouting.buildRoute('projects', this.project.id.toString()));
    }
}
