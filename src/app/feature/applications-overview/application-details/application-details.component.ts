import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ApplicationService} from '../../../core/services/application.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from '../../../shared/components/button/button.component';
import {MarkdownModule} from 'ngx-markdown';
import {ActiveAssignmentRoutingService} from '../../../core/services/active-assignment-routing.service';
import {AuthorizationService} from '../../../core/services/authorization.service';
import {Observable, Subscription} from 'rxjs';
import {Project} from '../../../shared/models/project.model';
import {ProjectService} from '../../../core/services/project.service';
import {ApplicationStatusEnum} from '../../../shared/models/ApplicationStatus.enum';
import {StatuscardComponent} from '../../../shared/components/statuscard/statuscard.component';
import {ToastService} from '../../../core/services/toast.service';
import {Application} from '../../../shared/models/application.model';
import {ConfirmationModalComponent} from '../../../shared/components/confirmation-modal/confirmation-modal.component';

@Component({
    selector: 'app-application-details',
    imports: [CommonModule, ButtonComponent, MarkdownModule, StatuscardComponent, ConfirmationModalComponent],
    templateUrl: './application-details.component.html',
    styleUrl: './application-details.component.scss'
})
export class ApplicationDetailsComponent implements OnInit, OnDestroy {
    private readonly applicationService = inject(ApplicationService);
    private readonly projectService: ProjectService = inject(ProjectService);
    private readonly route = inject(ActivatedRoute);
    private router: Router = inject(Router);
    private readonly activeAssignmentRouteService: ActiveAssignmentRoutingService = inject(ActiveAssignmentRoutingService);
    public authorizationService: AuthorizationService = inject(AuthorizationService);
    private readonly toastService: ToastService = inject(ToastService);

    applicationId = this.route.snapshot.params['id'];
    application$: Observable<Application> = this.applicationService.getApplication(this.applicationId);
    projectId: number | null = null;
    public isOwner$!: Observable<boolean>;
    public isMember$!: Observable<boolean>;
    public isApplicationOwner$!: Observable<boolean>;
    public project$: Observable<Project> | null = null;
    protected readonly ApplicationStatusEnum = ApplicationStatusEnum;
    showActionModal = false;
    selectedAction: 'approve' | 'reject' | null = null;
    selectedApplicationId: number | null = null;

    openActionModal(applicationId: number, action: 'approve'| 'reject'){
        this.selectedApplicationId = applicationId;
        this.selectedAction = action;
        this.showActionModal = true;
    }

    closeActionModal(){
        this.showActionModal = false;
        this.selectedAction= null;
        this.selectedApplicationId = null;
    }

    handleActionConfirm(){
        if(!this.selectedApplicationId || !this.selectedAction) return;
        const status = this.selectedAction === 'approve'
            ? ApplicationStatusEnum.APPROVED
            : ApplicationStatusEnum.REJECTED;
        this.reviewApplication(this.selectedApplicationId,status);
        this.closeActionModal();
    }
    private subscriptions: Subscription[] = [];

    ngOnInit() {
        const applicationSubscription = this.application$.subscribe({
            next: application => {
                this.projectId = application.project.id;
                this.isApplicationOwner$ = this.authorizationService.isApplicationOwner$(application);
                this.project$ = this.projectService.getProjectById(this.projectId.toString());

                const projectSubscription = this.project$.subscribe(project => {
                    this.isOwner$ = this.authorizationService.isOwner$(project);
                    this.isMember$ = this.authorizationService.isMember$(project);
                });

                this.subscriptions.push(projectSubscription);
            },
            error: () => {
                this.router.navigate(this.activeAssignmentRouteService.buildRoute('applications'));
            }
        });

        this.subscriptions.push(applicationSubscription);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    navigateToProject() {
        if (this.projectId === null) {
            console.error('Project ID is not set');
            return;
        }
        this.router.navigate(this.activeAssignmentRouteService.buildRoute('projects', this.projectId.toString()));
    }

    reviewApplication(applicationId: number, status: ApplicationStatusEnum) {
        try {
            this.application$ = this.projectService.reviewApplication(applicationId, status);
            this.toastService.showToast("success", "Application reviewed successfully");
        } catch (error) {
            this.toastService.showToast("error", "Failed to review application");
        }
    }

    joinProject(applicationId: number) {
        const joinProjectSubscription = this.projectService.joinProject(applicationId).subscribe(
            (application: Application) => {
                this.router.navigate(this.activeAssignmentRouteService.buildRoute('projects', application.project.id.toString()));
                this.toastService.showToast('success', 'Joined project successfully');
            }
        );
        this.subscriptions.push(joinProjectSubscription);
    }
}
