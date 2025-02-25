import {Component, OnInit, inject, OnDestroy} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { ProjectService } from '../../../core/services/project.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Project } from '../../../shared/models/project.model';
import { ActiveAssignmentRoutingService } from '../../../core/services/active-assignment-routing.service';
import { ActiveAssignmentService } from '../../../core/services/active-assignment.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-project-update',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MarkdownModule, LMarkdownEditorModule],
    templateUrl: './project-update.component.html',
    styleUrls: ['./project-update.component.scss']
})
export class ProjectUpdateComponent implements OnInit, OnDestroy {
    private projectService = inject(ProjectService);
    private readonly activeAssignmentService : ActiveAssignmentService = inject(ActiveAssignmentService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private activeAssignmentRoutingService = inject(ActiveAssignmentRoutingService);
    assignmentDefaultTeamSize = this.activeAssignmentService.getActiveAssignment()?.assignment.defaultTeamSize;

    projectForm: FormGroup = new FormGroup({
        title: new FormControl('', [Validators.required]),
        description: new FormControl(''),
        shortDescription: new FormControl('', [Validators.required]),
        teamSize: new FormControl(this.activeAssignmentService.getActiveAssignment()?.assignment.defaultTeamSize, [Validators.required]),
        repositoryUrl: new FormControl('', [Validators.required]),
        boardUrl: new FormControl('', [Validators.required])
    });

    charCount: number = 0;
    projectId!: number;
    projectData!: Project;
    private subscriptions: Subscription[] = [];

    ngOnInit(): void {
        // Use the parent route's paramMap if available.
        const parentParams = this.route.parent ? this.route.parent.snapshot.paramMap : this.route.snapshot.paramMap;
        const idParam = parentParams.get('id');
        if (!idParam) {
            console.error("No project id provided in route params");
            return;
        }
        this.projectId = +idParam;
        if (isNaN(this.projectId)) {
            console.error("Project id is NaN");
            return;
        }
        const projectSubscription = this.projectService.getProjectById(this.projectId.toString()).subscribe(project => {
            this.projectData = project;
            this.projectForm.patchValue({
                title: project.title,
                description: project.description,
                shortDescription: project.shortDescription,
                teamSize : project.teamSize,
                repositoryUrl: project.repositoryUrl,
                boardUrl : project.boardUrl
            });
            this.charCount = project.shortDescription?.length || 0;
        });
        this.subscriptions.push(projectSubscription);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    updateCharCount(): void {
        const shortDescriptionControl = this.projectForm.get('shortDescription');
        this.charCount = shortDescriptionControl?.value ? shortDescriptionControl.value.length : 0;
    }

    onSubmit(): void {
        if (this.projectForm.valid) {
            // Create an updated project object by merging original project data with form values
            const updatedProject: Project = {
                ...this.projectData,
                ...this.projectForm.value
            };
            const updateSubscription = this.projectService.updateProject(updatedProject.id, updatedProject).subscribe(
                project => {
                    console.log('Project bijgewerkt:', project);
                    this.router.navigate(this.activeAssignmentRoutingService.buildRoute('projects', project.id.toString()));
                }
            );
            this.subscriptions.push(updateSubscription);
        }
    }

    toggleFullScreen(): void {
        const editorElement = document.querySelector('md-editor');
        if (!document.fullscreenElement) {
            editorElement?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
}
