import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { TagcardComponent } from '../tagcard/tagcard.component';
import { ActiveAssignmentRoutingService } from '../../../core/services/active-assignment-routing.service';
import { Project } from '../../models/project.model';
import { Role } from '../../../auth/models/role.model';

@Component({
    selector: 'app-projectcard',
    standalone: true,
    imports: [CommonModule, MarkdownModule, TagcardComponent],
    templateUrl: './projectcard.component.html',
    styleUrl: './projectcard.component.scss'
})
export class ProjectcardComponent {
    @Input() project!: Project;

    private readonly router = inject(Router);
    private readonly assignmentRouting = inject(ActiveAssignmentRoutingService);

    navigateToProject(event: MouseEvent) {
        const route = this.project.createdBy.role === Role.Researcher && !this.project.assignmentId
            ? ['/projects', this.project.id.toString()]
            : this.assignmentRouting.buildRoute('projects', this.project.id.toString());
        if (event.ctrlKey || event.metaKey || event.button === 1) {
            const url = this.router.createUrlTree(route).toString();
            window.open(url, '_blank');
            return;
        }
        this.router.navigate(route);
    }
}
