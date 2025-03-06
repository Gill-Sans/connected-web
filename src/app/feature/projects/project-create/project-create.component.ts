import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { ProjectService } from '../../../core/services/project.service';
import { ActiveAssignmentService } from '../../../core/services/active-assignment.service';
import { Router } from '@angular/router';
import { Project } from '../../../shared/models/project.model';
import { ActiveAssignmentRoutingService } from '../../../core/services/active-assignment-routing.service';
import { Subscription } from 'rxjs';
import { TagcardComponent } from '../../../shared/components/tagcard/tagcard.component';
import { TagSearchComponentComponent } from '../../../shared/tag-search-component/tag-search-component.component';
import { tag } from '../../../shared/models/tag.model';
import { AuthorizationService } from '../../../core/services/authorization.service';
import { ToastService } from '../../../core/services/toast.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';

function minWordsValidator(minWords: number) {
    return (control: AbstractControl): ValidationErrors | null => {
        const value: string = control.value || '';
        if (!value.trim()) {
            // If empty, let required validator handle it.
            return null;
        }
        const wordCount = value.trim().split(/\s+/).length;
        return wordCount < minWords ? { minWords: { required: minWords, actual: wordCount } } : null;
    };
}

function minTagsValidator(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
        const tags = control.value;
        if (Array.isArray(tags) && tags.length < min) {
            return { minTags: { requiredTags: min, actualTags: tags.length } };
        }
        return null;
    };
}

@Component({
    selector: 'app-project-create',
    standalone: true,
    imports: [
        CommonModule,
        MarkdownModule,
        ReactiveFormsModule,
        LMarkdownEditorModule,
        TagcardComponent,
        TagSearchComponentComponent,
        ButtonComponent
    ],
    templateUrl: './project-create.component.html',
    styleUrls: ['./project-create.component.scss']
})
export class ProjectCreateComponent implements OnInit, OnDestroy {

    private readonly projectService: ProjectService = inject(ProjectService);
    private readonly activeAssignmentService: ActiveAssignmentService = inject(ActiveAssignmentService);
    private readonly activeAssignmentRoutingService: ActiveAssignmentRoutingService = inject(ActiveAssignmentRoutingService);
    private readonly router: Router = inject(Router);
    private readonly toastService: ToastService = inject(ToastService);
    private readonly authorizationsService: AuthorizationService = inject(AuthorizationService);
    private readonly isResearcher$ = this.authorizationsService.isResearcher$();
    private subscriptions: Subscription[] = [];

    tagList: tag[] = [];

    projectForm: FormGroup = new FormGroup({
        title: new FormControl('', [
            Validators.required,
            Validators.maxLength(255)
        ]),
        description: new FormControl('', [
            Validators.required,
            minWordsValidator(50)
        ]),
        shortDescription: new FormControl('', [
            Validators.required,
            Validators.maxLength(500)
        ]),
        teamSize: new FormControl(this.activeAssignmentService.getActiveAssignment()?.assignment.defaultTeamSize || 1, [
            Validators.required
        ]),
        tags: new FormControl([], [minTagsValidator(1)])
    });

    charCount: number = 0;
    markdownPreview: string = '';

    ngOnInit(): void {
        // Any initialization logic can go here.
    }

    updatePreview() {
        this.markdownPreview = this.projectForm.value.description || '';
    }

    updateCharCount(): void {
        const shortDescriptionControl = this.projectForm.get('shortDescription');
        this.charCount = shortDescriptionControl?.value ? shortDescriptionControl.value.length : 0;
    }

    onSubmit() {
        const assignmentId = this.activeAssignmentService.getActiveAssignment()?.assignment.id;
        this.isResearcher$.subscribe((isResearcher) => {
            if (this.projectForm.valid && isResearcher) {
                // Create global project if user is a researcher.
                this.subscriptions.push(
                    this.projectService.createGlobalProject(this.projectForm.value as Project)
                        .subscribe(project => {
                            this.router.navigate(this.activeAssignmentRoutingService.buildRoute('projects'));
                        })
                );
            } else if (this.projectForm.valid && assignmentId) {
                const project: Project = this.projectForm.value as Project;
                this.subscriptions.push(
                    this.projectService.createProject(assignmentId, project)
                        .subscribe(project => {
                            this.router.navigate(this.activeAssignmentRoutingService.buildRoute('projects', project.id.toString()));
                        })
                );
            } else {
                this.toastService.showToast('error', 'Please fill out all required fields.');
                this.projectForm.markAllAsTouched();
            }
        });
    }

    addTagToProject(selectedTag: tag) {
        if (!this.tagList.some(t => t.id === selectedTag.id)) {
            this.tagList.push(selectedTag);
            this.projectForm.patchValue({ tags: this.tagList });
        }
    }

    removeTag(tagId: number) {
        this.tagList = this.tagList.filter(tag => tag.id != tagId);
        this.projectForm.patchValue({ tags: this.tagList });
    }

    toggleFullScreen() {
        const editorElement = document.querySelector('md-editor');
        if (!document.fullscreenElement) {
            editorElement?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
