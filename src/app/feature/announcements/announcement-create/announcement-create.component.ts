import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AnnouncementService} from '../../../core/services/announcement.service';
import {ActiveAssignmentService} from '../../../core/services/active-assignment.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Announcement} from '../../../shared/models/announcement.model';
import {ActiveAssignment} from '../../../shared/models/activeAssignment.model';
import {ActiveAssignmentRoutingService} from '../../../core/services/active-assignment-routing.service';
import {ButtonComponent} from '../../../shared/components/button/button.component';
import {CommonModule} from '@angular/common';
import {ToastService} from '../../../core/services/toast.service';

@Component({
    selector: 'app-announcement-create',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonComponent
    ],
    templateUrl: './announcement-create.component.html',
    styleUrls: ['./announcement-create.component.scss']
})
export class AnnouncementCreateComponent implements OnInit, OnDestroy {
    private announcementService: AnnouncementService = inject(AnnouncementService);
    private activeAssignmentService: ActiveAssignmentService = inject(ActiveAssignmentService);
    public router: Router = inject(Router);
    public route: ActivatedRoute = inject(ActivatedRoute);
    private activeAssignmentRoutingService: ActiveAssignmentRoutingService = inject(ActiveAssignmentRoutingService);
    private toastService: ToastService = inject(ToastService);

    announcementForm: FormGroup = new FormGroup({
        title: new FormControl('', [Validators.required]),
        message: new FormControl('', [Validators.required])
    });

    assignmentId!: number | string;
    activeAssignment: ActiveAssignment | null = null;

    private subscriptions: Subscription[] = [];

    ngOnInit(): void {
        this.activeAssignment = this.activeAssignmentService.getActiveAssignment();
        if (this.activeAssignment) {
            this.assignmentId = this.activeAssignment.assignment.id;
        }
    }

    onSubmit(): void {
        if (this.announcementForm.valid && this.assignmentId) {
            const announcementData: Announcement = this.announcementForm.value;
            this.subscriptions.push(this.announcementService.createAnnouncement(this.assignmentId, announcementData)
                .subscribe({
                    next: (response) => {
                        this.toastService.showToast('success', 'Announcement created!');
                        this.router.navigate(this.activeAssignmentRoutingService.buildRoute('announcements'));
                    }
                })
        );
        } else {
            // Optionally mark all controls as touched to show validation errors.
            this.announcementForm.markAllAsTouched();
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
