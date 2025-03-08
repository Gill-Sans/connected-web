import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { ProjectService } from '../../../core/services/project.service';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import { Project } from '../../../shared/models/project.model';
import { ActiveAssignmentRoutingService } from '../../../core/services/active-assignment-routing.service';
import { ActiveAssignmentService } from '../../../core/services/active-assignment.service';
import {Observable, Subscription} from 'rxjs';
import { TagcardComponent } from '../../../shared/components/tagcard/tagcard.component';
import { TagSearchComponentComponent } from '../../../shared/tag-search-component/tag-search-component.component';
import { tag } from '../../../shared/models/tag.model';
import { ProjectStatusEnum } from '../../../shared/models/ProjectStatus.enum';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import {ToastService} from '../../../core/services/toast.service';
import {AuthorizationService} from '../../../core/services/authorization.service';
import {MdEditorComponent} from '../../../shared/components/md-editor/md-editor.component';

// Validator to check minimum number of words
function minWordsValidator(minWords: number) {
    return (control: AbstractControl): ValidationErrors | null => {
        const value: string = control.value || '';
        if (!value.trim()) {
            return null;
        }
        const wordCount = value.trim().split(/\s+/).length;
        return wordCount < minWords ? { minWords: { required: minWords, actual: wordCount } } : null;
    };
}

// Validator to ensure at least one tag is added
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
    selector: 'app-project-update',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MarkdownModule,
        LMarkdownEditorModule,
        TagSearchComponentComponent,
        TagcardComponent,
        ButtonComponent,
        MdEditorComponent
    ],
    templateUrl: './project-update.component.html',
    styleUrls: ['./project-update.component.scss']
})
export class ProjectUpdateComponent implements OnInit, OnDestroy {
    private readonly projectService: ProjectService = inject(ProjectService);
    private readonly activeAssignmentService: ActiveAssignmentService = inject(ActiveAssignmentService);
    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly activeAssignmentRoutingService: ActiveAssignmentRoutingService = inject(ActiveAssignmentRoutingService);
    private readonly toastService: ToastService = inject(ToastService);
    private readonly authorizationService: AuthorizationService = inject(AuthorizationService);

    public isCreatedByTeacher$!: Observable<boolean>;

    assignmentDefaultTeamSize: number | undefined = this.activeAssignmentService.getActiveAssignment()?.assignment.defaultTeamSize;

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
        teamSize: new FormControl(this.assignmentDefaultTeamSize || 1, [
            Validators.required
        ]),
        repositoryUrl: new FormControl(null),
        boardUrl: new FormControl(null),
        tags: new FormControl([], [minTagsValidator(1)])
    });

    charCount: number = 0;
    projectId!: number;
    projectData!: Project;
    projectStatus: ProjectStatusEnum | undefined;
    private subscriptions: Subscription[] = [];

    ngOnInit(): void {
        const parentParams: ParamMap = this.route.parent ? this.route.parent.snapshot.paramMap : this.route.snapshot.paramMap;
        const idParam: string | null = parentParams.get('id');
        if (!idParam) {
            console.error("No project id provided in route params");
            return;
        }
        this.projectId = +idParam;
        if (isNaN(this.projectId)) {
            console.error("Project id is NaN");
            return;
        }
        const projectSubscription: Subscription = this.projectService.getProjectById(this.projectId.toString()).subscribe(project => {
            this.projectData = project;
            this.projectStatus = project.status;
            this.isCreatedByTeacher$ = this.authorizationService.isCreatedByTeacher$(project);
            this.projectForm.patchValue({
                title: project.title,
                description: project.description,
                shortDescription: project.shortDescription,
                teamSize: project.teamSize,
                repositoryUrl: project.repositoryUrl,
                boardUrl: project.boardUrl,
                tags: project.tags
            });
            this.charCount = project.shortDescription?.length || 0;
            this.tagList = project.tags;
        });
        this.subscriptions.push(projectSubscription);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    updateCharCount(): void {
        const shortDescriptionControl: AbstractControl | null  = this.projectForm.get('shortDescription');
        this.charCount = shortDescriptionControl?.value ? shortDescriptionControl.value.length : 0;
    }

    addTagToProject(selectedTag: tag): void {
        if (!this.tagList.some(t => t.id === selectedTag.id)) {
            this.tagList.push(selectedTag);
            this.projectForm.patchValue({ tags: this.tagList });
        }
    }

    removeTag(tagId: number): void {
        this.tagList = this.tagList.filter(tag => tag.id !== tagId);
        this.projectForm.patchValue({ tags: this.tagList });
    }

    onSubmit(): void {
        if (this.projectForm.valid) {
            const updatedProject: Project = {
                ...this.projectData,
                ...this.projectForm.value,
                tags: this.tagList
            };
            const updateSubscription = this.projectService.updateProject(updatedProject.id, updatedProject).subscribe(
                project => {
                    this.router.navigate(this.activeAssignmentRoutingService.buildRoute('projects', project.id.toString()));
                }
            );
            this.subscriptions.push(updateSubscription);
        } else {
            this.toastService.showToast('error', 'Please fill out all required fields.');
            this.projectForm.markAllAsTouched();
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
