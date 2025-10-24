import {Component, inject, Input} from '@angular/core';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {TagcardComponent} from '../tagcard/tagcard.component';
import {ActiveAssignmentRoutingService} from '../../../core/services/active-assignment-routing.service';
import {Project} from '../../models/project.model';
import {Role} from '../../../auth/models/role.model';
import {StatuscardComponent} from '../statuscard/statuscard.component';
import {User} from '../../../auth/models/user.model';
import {AvatarModule} from 'primeng/avatar';
import {AvatarGroupModule} from 'primeng/avatargroup';
import {tag} from '../../models/tag.model';

@Component({
    selector: 'app-projectcard',
    standalone: true,
    imports: [CommonModule, TagcardComponent, StatuscardComponent, AvatarModule, AvatarGroupModule],
    templateUrl: './projectcard.component.html',
    styleUrl: './projectcard.component.scss'
})
export class ProjectcardComponent {
    @Input() project!: Project;

    private readonly router = inject(Router);
    private readonly assignmentRouting = inject(ActiveAssignmentRoutingService);

    protected readonly maxVisibleMembers = 2;
    protected readonly maxVisibleTags = 3;

    protected get visibleMembers(): User[] {
        return (this.project?.members ?? []).slice(0, this.maxVisibleMembers);
    }

    protected get visibleTags(): tag[] {
        return (this.project?.tags ?? []).slice(0, this.maxVisibleTags);
    }

    protected get remainingMemberCount(): number {
        const total = this.project?.members?.length ?? 0;
        return Math.max(total - this.maxVisibleMembers, 0);
    }

    protected get hasTags(): boolean {
        return this.visibleTags.length > 0;
    }

    protected initialsFor(user: User): string {
        const first = user.firstName?.[0] ?? '';
        const last = user.lastName?.[0] ?? '';
        return (first + last).toUpperCase() || '?';
    }

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
