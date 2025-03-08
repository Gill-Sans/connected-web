import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {AnnouncementService} from '../../core/services/announcement.service';
import {ActiveAssignmentService} from '../../core/services/active-assignment.service';
import {ActiveAssignmentRoutingService} from '../../core/services/active-assignment-routing.service';
import {Router} from '@angular/router';
import {Announcement} from '../../shared/models/announcement.model';
import {Observable, Subscription} from 'rxjs';
import {CommonModule} from '@angular/common';
import {AnnouncementCardComponent} from '../../shared/components/announcement-card/announcement-card.component';
import {ActiveAssignment} from '../../shared/models/activeAssignment.model';
import {ButtonComponent} from '../../shared/components/button/button.component';
import {ProjectService} from '../../core/services/project.service';
import {Project} from '../../shared/models/project.model';
import {ProjectcardComponent} from '../../shared/components/projectcard/projectcard.component';
import {CalendarSmallComponent} from '../../shared/components/calendar-small/calendar-small.component';
import {Deadline} from '../../shared/models/deadline.model';
import {DeadlineService} from '../../core/services/deadline.service';

@Component({
  selector: 'app-dashboard',
    imports: [
        CommonModule,
        AnnouncementCardComponent,
        CalendarSmallComponent,
        ButtonComponent,
        ProjectcardComponent,
    ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
    private announcementService: AnnouncementService = inject(AnnouncementService);
    private readonly deadlineService: DeadlineService = inject(DeadlineService);
    private readonly projectService: ProjectService = inject(ProjectService);
    private activeAssignmentService: ActiveAssignmentService = inject(ActiveAssignmentService);
    private activeAssignmentRoutingService: ActiveAssignmentRoutingService = inject(ActiveAssignmentRoutingService);
    private router: Router = inject(Router);

    announcements: Announcement[] = [];
    deadlines$: Observable<Deadline[]> | null = null;
    activeAssignment$: Observable<ActiveAssignment | null> = this.activeAssignmentService.activeAssignment$;
    private subscriptions: Subscription[] = [];
    project: Project | null = null;

    ngOnInit(): void {
        this.subscriptions.push(this.activeAssignment$.subscribe({
            next: (activeAssignment) => {
                if (activeAssignment) {
                    this.subscriptions.push(this.announcementService.getAnnouncements(activeAssignment.assignment.id)
                        .subscribe({
                            next: (announcements) => {
                                this.announcements = announcements;
                            },
                            error: (err) => {
                                console.error("Failed to load announcements", err);
                            }
                        })
                    );

                    this.subscriptions.push(this.projectService.getProjectByUserAndAssignmentId(activeAssignment.assignment.id.toString())
                        .subscribe({
                            next: (project) => {
                                this.project = project;
                            }
                        })
                    );

                    // Call loadDeadlinesForAssignment after setting the active assignment
                    this.loadDeadlinesForAssignment();
                }
            },
            error: (err) => {
                console.error("Failed to load active assignment", err);
            }
        }));
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
