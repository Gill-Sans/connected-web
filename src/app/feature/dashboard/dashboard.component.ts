import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AnnouncementService } from '../../core/services/announcement.service';
import { DeadlineService } from '../../core/services/deadline.service';
import { ProjectService } from '../../core/services/project.service';
import { ActiveAssignmentService } from '../../core/services/active-assignment.service';
import { ActiveAssignmentRoutingService } from '../../core/services/active-assignment-routing.service';
import { Announcement } from '../../shared/models/announcement.model';
import { Deadline } from '../../shared/models/deadline.model';
import { Project } from '../../shared/models/project.model';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { AnnouncementCardComponent } from '../../shared/components/announcement-card/announcement-card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ProjectcardComponent } from '../../shared/components/projectcard/projectcard.component';
import { CalendarSmallComponent } from '../../shared/components/calendar-small/calendar-small.component';
import {HasRoleDirective} from '../../shared/directives/HasRole.directive';
import {Role} from '../../auth/models/role.model';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        AnnouncementCardComponent,
        CalendarSmallComponent,
        ButtonComponent,
        ProjectcardComponent,
        BaseChartDirective,
        HasRoleDirective
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    private readonly announcementService = inject(AnnouncementService);
    private readonly deadlineService = inject(DeadlineService);
    private readonly projectService = inject(ProjectService);
    private readonly activeAssignmentService = inject(ActiveAssignmentService);
    private readonly activeAssignmentRoutingService = inject(ActiveAssignmentRoutingService);
    private readonly router = inject(Router);
    protected readonly Role = Role;

    announcements: Announcement[] = [];
    deadlines$: Observable<Deadline[]> | null = null;
    project: Project | null = null;

    // Chart configuration for Project Submission Overview pie chart
    submissionChartData: {
        datasets: { backgroundColor: string[]; data: number[]; hoverBackgroundColor: string[] }[];
        labels: string[]
    } = {
        labels: ['Submitted', 'Not Submitted'],
        datasets: [
            {
                data: [40, 60], // Placeholder values; replace with real data when available.
                backgroundColor: ['#28a745', '#dc3545'],
                hoverBackgroundColor: ['#218838', '#c82333']
            }
        ]
    };

    submissionChartOptions: ChartConfiguration<'pie'>['options'] = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    };

    submissionChartType: 'pie' = 'pie';

    activeAssignment$ = this.activeAssignmentService.activeAssignment$;
    private subscriptions: Subscription[] = [];

    ngOnInit(): void {
        this.subscriptions.push(
            this.activeAssignment$.subscribe({
                next: (activeAssignment) => {
                    if (activeAssignment) {
                        const assignmentId = activeAssignment.assignment.id;
                        this.subscriptions.push(
                            this.announcementService.getAnnouncements(assignmentId).subscribe({
                                next: (announcements) => {
                                    this.announcements = announcements;
                                },
                                error: (err) => {
                                    console.error('Failed to load announcements', err);
                                }
                            })
                        );
                        this.subscriptions.push(
                            this.projectService.getProjectByUserAndAssignmentId(assignmentId.toString()).subscribe({
                                next: (project) => {
                                    this.project = project;
                                }
                            })
                        );
                        this.loadDeadlinesForAssignment();
                    }
                },
                error: (err) => {
                    console.error('Failed to load active assignment', err);
                }
            })
        );
    }

    loadDeadlinesForAssignment(): void {
        const activeAssignment = this.activeAssignmentService.getActiveAssignment();
        const assignmentId = activeAssignment?.assignment.id;
        if (assignmentId) {
            this.deadlines$ = this.deadlineService.getAllDeadlinesForAssignment(assignmentId);
        }
    }

    navigateToProjects(): void {
        this.router.navigate(this.activeAssignmentRoutingService.buildRoute('projects'));
    }

    navigateToProject(id: number): void {
        this.router.navigate(this.activeAssignmentRoutingService.buildRoute('project', id.toString()));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
