import { Component, inject, OnInit } from '@angular/core';
import { ConversationcardComponent } from "../../../../../shared/components/conversationcard/conversationcard.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { Observable } from 'rxjs';
import { Project } from '../../../../../shared/models/project.model';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../../../../core/services/project.service';
import { createFeedback, Feedback } from '../../../../../shared/models/feedback.model';
import { ToastService } from '../../../../../core/services/toast.service';
import {AuthorizationService} from '../../../../../core/services/authorization.service';

@Component({
    selector: 'app-feedback',
    imports: [ConversationcardComponent, CommonModule, FormsModule, ButtonComponent],
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
    private readonly projectService: ProjectService = inject(ProjectService);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly toastService: ToastService = inject(ToastService);
    public authorizationService: AuthorizationService = inject(AuthorizationService);

    private projectId: string = 'undefined';
    public project$: Observable<Project> | null = null;
    public feedbackList$: Observable<Feedback[]> | null = null;
    public isTeacher$!: Observable<boolean>;
    public newFeedback: string = '';

    ngOnInit() {
        this.isTeacher$ = this.authorizationService.isTeacher$();

        this.route.parent?.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.projectId = id;
                this.project$ = this.projectService.getProject(this.projectId);
                this.loadFeedback();
            }
        });
    }

    loadFeedback() {
        this.feedbackList$ = this.projectService.getFeedback(this.projectId);
    }

    submitFeedback() {
        if (this.newFeedback.trim() === '') return;

        const feedback: createFeedback = {
            comment: this.newFeedback,
        };

        this.projectService.submitFeedback(this.projectId, feedback).subscribe(() => {
            this.toastService.showToast('success', 'Your feedback has been submitted!');
            this.newFeedback = '';
            this.loadFeedback();
        });
    }
}
