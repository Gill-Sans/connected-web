import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { ProjectService } from '../../core/services/project.service';
import { ToastService } from '../../core/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApplicationCreate } from '../../shared/models/application.model';
import {ButtonComponent} from '../../shared/components/button/button.component';
import {ActiveAssignmentRoutingService} from '../../core/services/active-assignment-routing.service';

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
export class ApplicationsCreateComponent {
  private readonly projectService: ProjectService = inject(ProjectService);
  private readonly toastService: ToastService = inject(ToastService);
  private readonly assignmentRouting: ActiveAssignmentRoutingService = inject(ActiveAssignmentRoutingService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  private projectId: string = 'undefined';

  applicationForm = new FormGroup({
    motivationMd: new FormControl(''),
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.projectId = id;
      }
    })
  }

  onSubmit() {
    if (this.applicationForm.value.motivationMd === '') {
      this.toastService.showToast('error', 'Please fill in the application text.');
      return;
    }
    let application: ApplicationCreate = this.applicationForm.value as ApplicationCreate;
    this.projectService.applyForProject(this.projectId, application).subscribe(() => {
      this.toastService.showToast('success', 'Application submitted');
      this.router.navigate(['/projects']);
    });
  }

    return() {
        this.router.navigate(this.assignmentRouting.buildRoute('projects', this.projectId.toString()));
    }
}
