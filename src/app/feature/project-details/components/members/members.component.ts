import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Observable} from 'rxjs';
import {Project} from '../../../../shared/models/project.model';
import {ProjectService} from '../../../../core/services/project.service';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-members',
    imports: [CommonModule],
    templateUrl: './members.component.html',
    styleUrl: './members.component.scss'
})
export class MembersComponent implements OnInit {
    private readonly projectService: ProjectService = inject(ProjectService);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private projectId: string = 'undefined';
    public project$: Observable<Project> | null = null;

    ngOnInit() {
        this.route.parent?.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.projectId = id;
                this.project$ = this.projectService.getProject(this.projectId);
            }
        });
    }

}
