import {Component, inject, OnInit} from '@angular/core';
import { ApplicationService } from '../../../core/services/application.service';
import {ActivatedRoute, Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { MarkdownModule } from 'ngx-markdown';
import {Application} from 'express';
import {ActiveAssignmentRoutingService} from '../../../core/services/active-assignment-routing.service';
@Component({
  selector: 'app-application-details',
  imports: [CommonModule,ButtonComponent,MarkdownModule],
  templateUrl: './application-details.component.html',
  styleUrl: './application-details.component.scss'
})

export class ApplicationDetailsComponent implements OnInit {
  private readonly applicationService = inject(ApplicationService);
  private readonly route = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private readonly activeAssignmentRouteService: ActiveAssignmentRoutingService = inject(ActiveAssignmentRoutingService);
  applicationId = this.route.snapshot.params['id'];
  application$ = this.applicationService.getApplication(this.applicationId);
  projectId: number | null = null;

  ngOnInit() {
    this.application$.subscribe(application => {
      console.log('Application:', application);
      this.projectId = application.project.id;
    });
  }

    navigateToProject() {
      if (this.projectId === null) {
        console.error('Project ID is not set');
        return;
      }
        this.router.navigate(this.activeAssignmentRouteService.buildRoute('projects', this.projectId.toString()));
    }
}
