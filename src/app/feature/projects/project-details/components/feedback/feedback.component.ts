import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { ConversationcardComponent } from "../../../../../shared/components/conversationcard/conversationcard.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import {Observable, Subscription} from 'rxjs';
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
export class FeedbackComponent implements OnInit, OnDestroy {
    private readonly projectService: ProjectService = inject(ProjectService);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly toastService: ToastService = inject(ToastService);
    public authorizationService: AuthorizationService = inject(AuthorizationService);

    private projectId: string = 'undefined';
    public project$: Observable<Project> | null = null;
    public feedbackList$: Observable<Feedback[]> | null = null;
    public isTeacher$!: Observable<boolean>;
    public newFeedback: string = '';
    public editingFeedback: Feedback | null = null;
    private subscriptions: Subscription[] = [];

    ngOnInit() {
        this.isTeacher$ = this.authorizationService.isTeacher$();

        const routeSubscription = this.route.parent?.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.projectId = id;
                this.project$ = this.projectService.getProjectById(this.projectId);
                this.loadFeedback();
            }
        });

        if (routeSubscription) {
            this.subscriptions.push(routeSubscription);
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    loadFeedback() {
        this.feedbackList$ = this.projectService.getFeedback(this.projectId);
    }

    submitFeedback() {
        if (this.newFeedback.trim() === '') return;

        const feedback: createFeedback = {
            comment: this.newFeedback,
        };

        const submitSubscription = this.projectService.submitFeedback(this.projectId, feedback).subscribe(() => {
            this.toastService.showToast('success', 'Your feedback has been submitted!');
            this.newFeedback = '';
            this.loadFeedback();
        });

        this.subscriptions.push(submitSubscription);
    }

    updateFeedback(feedback: Feedback) {
        this.editingFeedback = feedback;
    }

    deleteFeedback(feedback: Feedback) {
        console.log('Deleting feedback with ID:', feedback.id);
        const deleteSubscription = this.projectService.deleteFeedbackByTeacher(feedback.id).subscribe(() => {
            this.toastService.showToast('success', 'Feedback deleted!');
            this.loadFeedback();
        });

        this.subscriptions.push(deleteSubscription);
    }

    cancelEdit(feedbackId: number) {
        this.editingFeedback = null;
    }

    confirmEdit(feedbackId: number, comment: string) {
        if (!this.editingFeedback || this.editingFeedback.id === undefined) {
            console.error('Editing feedback is not defined or has no ID.');
            return; // Exit if editingFeedback is not valid
        }

        const updatedFeedback: Feedback = {
            ...this.editingFeedback,
            comment,
            id: this.editingFeedback.id // Ensure id is explicitly set
        };

        const updateSubscription = this.projectService.updateFeedbackByTeacher(feedbackId, updatedFeedback).subscribe(() => {
            this.toastService.showToast('success', 'Feedback updated!');
            this.loadFeedback();
            this.editingFeedback = null; // Reset editingFeedback after update
        });

        this.subscriptions.push(updateSubscription);
    }
}
