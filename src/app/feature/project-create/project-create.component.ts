import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { ProjectService } from '../../core/services/project.service';
import { ActiveAssignmentService } from '../../core/services/active-assignment.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-project-create',
    imports: [CommonModule, MarkdownModule, ReactiveFormsModule, LMarkdownEditorModule],
    templateUrl: './project-create.component.html',
    styleUrl: "./project-create.component.scss"
})
export class ProjectCreateComponent implements OnInit {

    private readonly projectService: ProjectService = inject(ProjectService);
    private readonly activeAssignmentService: ActiveAssignmentService = inject(ActiveAssignmentService);
    private readonly router: Router = inject(Router);

    ngOnInit() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
        document.head.appendChild(link);
    }

    projectForm = new FormGroup({
        title: new FormControl('', [Validators.required]),
        description: new FormControl('')
    });

    markdownPreview = '';

    updatePreview() {
        this.markdownPreview = this.projectForm.value.description || '';
    }

    onSubmit() {
        const assignmentId = this.activeAssignmentService.getActiveAssignment()?.assignment.id;
        if (this.projectForm.valid && assignmentId) {
            this.projectService.createProject(assignmentId, { title: this.projectForm.value.title || '', description: this.projectForm.value.description || '' }).subscribe(project => {
                console.log('Project created:', project);
                this.router.navigate(['/projects']);
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
