import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MarkdownModule} from 'ngx-markdown';
import {LMarkdownEditorModule} from 'ngx-markdown-editor';
import {ProjectService} from '../../../core/services/project.service';
import {ActiveAssignmentService} from '../../../core/services/active-assignment.service';
import {Router} from '@angular/router';
import {Project} from '../../../shared/models/project.model';
import {ActiveAssignmentRoutingService} from '../../../core/services/active-assignment-routing.service';
import {Subscription} from 'rxjs';
import {TagcardComponent} from '../../../shared/components/tagcard/tagcard.component';
import {TagSearchComponentComponent} from '../../../shared/tag-search-component/tag-search-component.component';
import {tag} from '../../../shared/models/tag.model';
import {AuthorizationService} from '../../../core/services/authorization.service';
import {ToastService} from '../../../core/services/toast.service';
import {ButtonComponent} from '../../../shared/components/button/button.component';

@Component({
    selector: 'app-project-create',
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
    styleUrl: "./project-create.component.scss"
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

    tag: tag | null = null;
    tagList: tag[] = [];

    ngOnInit() {
    }

    projectForm = new FormGroup({
        title: new FormControl('', [Validators.required]),
        description: new FormControl(''),
        shortDescription: new FormControl('', [Validators.required]),
        teamSize: new FormControl(this.activeAssignmentService.getActiveAssignment()?.assignment.defaultTeamSize || 1, [Validators.required]),
        tags: new FormControl()
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
        const isResearcherSubscription = this.isResearcher$.subscribe((isResearcher) => {
            if (this.projectForm.valid && isResearcher) {
                const createGlobalProjectSubscription = this.projectService.createGlobalProject(this.projectForm.value as Project).subscribe(project => {
                    this.router.navigate(this.activeAssignmentRoutingService.buildRoute('projects'));
                });
                this.subscriptions.push(createGlobalProjectSubscription);
            } else {
                if (this.projectForm.valid && assignmentId) {
                    let project: Project = this.projectForm.value as Project;
                    const createProjectSubscription = this.projectService.createProject(assignmentId, project).subscribe(project => {
                        this.router.navigate(this.activeAssignmentRoutingService.buildRoute('projects'));
                    });
                    this.subscriptions.push(createProjectSubscription);
                } else {
                    this.toastService.showToast('error', 'Please fill out all required fields');
                }
            }
        });
        this.subscriptions.push(isResearcherSubscription);
    }

    addTagToProject(selectedTag: tag) {
        if (!this.tagList.some(t => t.id === selectedTag.id)) {
            this.tagList.push(selectedTag);
            this.projectForm.patchValue({tags: this.tagList});
        }
    }

    removeTag(tagId: number) {
        this.tagList = this.tagList.filter(tag => tag.id != tagId);
        this.projectForm.patchValue({tags: this.tagList})
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
