import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from '../../../shared/components/button/button.component';
import {AnnouncementService} from '../../../core/services/announcement.service';
import {ActiveAssignmentService} from '../../../core/services/active-assignment.service';
import {Router} from '@angular/router';
import {Announcement} from '../../../shared/models/announcement.model';
import {Subscription} from 'rxjs';
import {ActiveAssignmentRoutingService} from '../../../core/services/active-assignment-routing.service';

@Component({
    selector: 'app-announcement-overview',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: './announcement-overview.component.html',
    styleUrls: ['./announcement-overview.component.scss']
})
export class AnnouncementOverviewComponent implements OnInit, OnDestroy {
    private announcementService: AnnouncementService = inject(AnnouncementService);
    private activeAssignmentService: ActiveAssignmentService = inject(ActiveAssignmentService);
    private activeAssignmentRoutingService: ActiveAssignmentRoutingService = inject(ActiveAssignmentRoutingService);
    private router: Router = inject(Router);

    announcements: Announcement[] = [];
    activeAssignment: any;
    assignmentId!: number | string;
    private subscriptions: Subscription[] = [];

    ngOnInit(): void {
        this.activeAssignment = this.activeAssignmentService.getActiveAssignment();
        if (this.activeAssignment) {
            this.assignmentId = this.activeAssignment.assignment.id;
            this.subscriptions.push(this.announcementService.getAnnouncements(this.assignmentId)
                .subscribe({
                    next: (announcements) => {
                        this.announcements = announcements;
                    },
                    error: (err) => {
                        console.error("Failed to load announcements", err);
                    }
                })
            );
        } else {
            console.error("No active assignment found");
            this.router.navigate(['/']);
        }
    }

    createAnnouncement(): void {
        this.router.navigate(this.activeAssignmentRoutingService.buildRoute('announcements', 'create'));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
