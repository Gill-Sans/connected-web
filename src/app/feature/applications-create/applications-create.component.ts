import { CommonModule } from '@angular/common';
import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { ProjectService } from '../../core/services/project.service';
import { ToastService } from '../../core/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {Application, ApplicationCreate} from '../../shared/models/application.model';
import {ActiveAssignmentRoutingService} from '../../core/services/active-assignment-routing.service';
import {Subscription} from 'rxjs';
import {ButtonComponent} from '../../shared/components/button/button.component';

@Component({
  selector: 'app-applications-create',
  imports: [
      MarkdownModule,
      LMarkdownEditorModule,
      CommonModule,
      ReactiveFormsModule,
      ButtonComponent
  ],
  templateUrl: './applications-create.component.html',
  styleUrl: './applications-create.component.scss'
})
export class ApplicationsCreateComponent implements OnInit, OnDestroy {

    private readonly projectService: ProjectService = inject(ProjectService);
    private readonly toastService: ToastService = inject(ToastService);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly router: Router = inject(Router);
    private activeAssignmentRoutingService = inject(ActiveAssignmentRoutingService);
    private projectId: string = 'undefined';

    applicationForm = new FormGroup({
        motivationMd: new FormControl(''),
    });

    private subscriptions: Subscription[] = [];

    ngOnInit() {
        const routeSub = this.route.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.projectId = id;
            }
        });
        this.subscriptions.push(routeSub);
    }

    onSubmit() {
        if (this.applicationForm.value.motivationMd === '') {
            this.toastService.showToast('error', 'Please fill in the application text.');
            return;
        }
        let application: ApplicationCreate = this.applicationForm.value as ApplicationCreate;
        const applySub = this.projectService.applyForProject(this.projectId, application).subscribe((application: Application) => {
            this.toastService.showToast('success', 'Application submitted');
            this.router.navigate(this.activeAssignmentRoutingService.buildRoute('applications', application.id.toString()));
        });
        this.subscriptions.push(applySub);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
