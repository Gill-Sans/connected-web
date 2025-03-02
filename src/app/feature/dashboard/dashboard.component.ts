import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {AnnouncementService} from '../../core/services/announcement.service';
import {ActiveAssignmentService} from '../../core/services/active-assignment.service';
import {ActiveAssignmentRoutingService} from '../../core/services/active-assignment-routing.service';
import {Router} from '@angular/router';
import {Announcement} from '../../shared/models/announcement.model';
import {Subscription} from 'rxjs';
import {CommonModule} from '@angular/common';
import {AnnouncementCardComponent} from '../../shared/components/announcement-card/announcement-card.component';
import {ActiveAssignment} from '../../shared/models/activeAssignment.model';
import {CalendarComponent} from '../../shared/components/calendar/calendar.component';

@Component({
  selector: 'app-dashboard',
  imports: [
      CommonModule,
      AnnouncementCardComponent,
      CalendarComponent

  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
    private announcementService: AnnouncementService = inject(AnnouncementService);
    private activeAssignmentService: ActiveAssignmentService = inject(ActiveAssignmentService);
    private activeAssignmentRoutingService: ActiveAssignmentRoutingService = inject(ActiveAssignmentRoutingService);
    private router: Router = inject(Router);

    announcements: Announcement[] = [];
    activeAssignment: ActiveAssignment | null = null;
    private subscriptions: Subscription[] = [];

    ngOnInit(): void {
        console.log("DashboardComponent ngOnInit");
        this.activeAssignment = this.activeAssignmentService.getActiveAssignment();
        if (this.activeAssignment) {
            this.subscriptions.push(this.announcementService.getAnnouncements(this.activeAssignment.assignment.id)
                .subscribe({
                    next: (announcements) => {
                        console.log("Announcements loaded", announcements);
                        this.announcements = announcements;
                    },
                    error: (err) => {
                        console.error("Failed to load announcements", err);
                    }
                })
            );
        }
    }

    createAnnouncement(): void {
        this.router.navigate(this.activeAssignmentRoutingService.buildRoute('announcements', 'create'));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
