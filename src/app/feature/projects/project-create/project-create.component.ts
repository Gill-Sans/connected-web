import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { ProjectService } from '../../../core/services/project.service';
import { ActiveAssignmentService } from '../../../core/services/active-assignment.service';
import { Router } from '@angular/router';
import { Project } from '../../../shared/models/project.model';
import {ActiveAssignmentRoutingService} from '../../../core/services/active-assignment-routing.service';

@Component({
    selector: 'app-project-create',
    imports: [CommonModule, MarkdownModule, ReactiveFormsModule, LMarkdownEditorModule],
    templateUrl: './project-create.component.html',
    styleUrl: "./project-create.component.scss"
})
export class ProjectCreateComponent implements OnInit {

    private readonly projectService: ProjectService = inject(ProjectService);
    private readonly activeAssignmentService: ActiveAssignmentService = inject(ActiveAssignmentService);
    private readonly activeAssignmentRoutingService: ActiveAssignmentRoutingService = inject(ActiveAssignmentRoutingService);
    private readonly router: Router = inject(Router);
    assignmentDefaultTeamSize = this.activeAssignmentService.getActiveAssignment()?.assignment.defaultTeamSize;
    ngOnInit() {
    }

    projectForm = new FormGroup({
        title: new FormControl('', [Validators.required]),
        description: new FormControl(''),
        shortDescription: new FormControl('', [Validators.required]),
        teamSize: new FormControl(this.activeAssignmentService.getActiveAssignment()?.assignment.defaultTeamSize, [Validators.required])
    });


    charCount: number = 0;
    markdownPreview = '';

    updatePreview() {
        this.markdownPreview = this.projectForm.value.description || '';
    }

    updateCharCount(): void {
        const shortDescriptionControl = this.projectForm.get('shortDescription');
        this.charCount = shortDescriptionControl?.value ? shortDescriptionControl.value?.length : 0;
    }


    onSubmit() {
        const assignmentId = this.activeAssignmentService.getActiveAssignment()?.assignment.id;
        if (this.projectForm.valid && assignmentId) {
            let project: Project = this.projectForm.value as Project;
            project.tags = [];
            this.projectService.createProject(assignmentId, project).subscribe(project => {
                console.log('Project created:', project);
                this.router.navigate(this.activeAssignmentRoutingService.buildRoute('projects'));
            });
            console.log('Project submitted:', this.projectForm.value);
        }
    }


    toggleFullScreen() {
        const editorElement = document.querySelector('md-editor');
        if (!document.fullscreenElement) {
            editorElement?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
}
