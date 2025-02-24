import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Observable} from 'rxjs';
import {Project} from '../../../../../shared/models/project.model';
import {ProjectService} from '../../../../../core/services/project.service';
import {ActivatedRoute} from '@angular/router';
import {AuthorizationService} from '../../../../../core/services/authorization.service';
import {ToastService} from '../../../../../core/services/toast.service';

@Component({
    selector: 'app-members',
    imports: [CommonModule],
    templateUrl: './members.component.html',
    styleUrl: './members.component.scss'
})
export class MembersComponent implements OnInit {
    private readonly projectService: ProjectService = inject(ProjectService);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly authorizationService: AuthorizationService = inject(AuthorizationService);
    private readonly toastService: ToastService = inject(ToastService);
    private projectId: string = 'undefined';
    public project$: Observable<Project> | null = null;
    public isTeacher$!: Observable<boolean>;


    ngOnInit() {
        this.isTeacher$ = this.authorizationService.isTeacher$();

        this.route.parent?.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.projectId = id;
                this.project$ = this.projectService.getProjectById(this.projectId);
            }
        });
    }

    removeMember(index: number) {
        this.project$?.subscribe(project => {
            const memberId = project.members[index].id.toString();
            this.projectService.removeMember(this.projectId, memberId).subscribe(() => {
                this.toastService.showToast('success', 'Member removed successfully');
                this.project$ = this.projectService.getProjectById(this.projectId);
            });
        });
    }
}
