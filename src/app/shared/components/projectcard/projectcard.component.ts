import {Component, inject, Input} from '@angular/core';
import {TagcardComponent} from '../tagcard/tagcard.component';
import {CommonModule} from '@angular/common';
import {tag} from '../../models/tag.model';
import {Router, RouterModule} from '@angular/router';
import {ActiveAssignmentRoutingService} from '../../../core/services/active-assignment-routing.service';

@Component({
    selector: 'app-projectcard',
    imports: [TagcardComponent, CommonModule, RouterModule],
    templateUrl: './projectcard.component.html',
    styleUrl: './projectcard.component.scss'
})
export class ProjectcardComponent {
    @Input() title: string = 'placeholder';
    @Input() description: string = 'placeholder';
    @Input() tags: tag[] = [{id: 0, name: 'placeholder'}];  // Changed to tag[]
    @Input() id!: number;

    router: Router = inject(Router);
    private readonly assignmentRouting: ActiveAssignmentRoutingService = inject(ActiveAssignmentRoutingService);

    navigateToProject() {
        const route = this.assignmentRouting.buildRoute('projects', this.id.toString());
        this.router.navigate(route);
    }
}
