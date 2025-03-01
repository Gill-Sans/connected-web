import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Observable, Subscription} from 'rxjs';
import {Project} from '../../../../../shared/models/project.model';
import {ProjectService} from '../../../../../core/services/project.service';
import {ActivatedRoute} from '@angular/router';
import {AuthorizationService} from '../../../../../core/services/authorization.service';
import {ToastService} from '../../../../../core/services/toast.service';
import {ButtonComponent} from '../../../../../shared/components/button/button.component';
import {User} from '../../../../../auth/models/user.model';

@Component({
    selector: 'app-members',
    imports: [CommonModule, ButtonComponent],
    templateUrl: './members.component.html',
    styleUrl: './members.component.scss'
})
export class MembersComponent implements OnInit, OnDestroy {
    private readonly projectService: ProjectService = inject(ProjectService);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly authorizationService: AuthorizationService = inject(AuthorizationService);
    private readonly toastService: ToastService = inject(ToastService);
    private projectId: string = 'undefined';
    public project$: Observable<Project> | null = null;
    public isTeacher$!: Observable<boolean>;
    private subscriptions: Subscription[] = [];

    showModal: boolean = false;
    selectedMember: User | null = null;



    ngOnInit() {
        this.isTeacher$ = this.authorizationService.isTeacher$();

        const routeSubscription = this.route.parent?.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.projectId = id;
                this.project$ = this.projectService.getProjectById(this.projectId);
            }
        });

        if (routeSubscription) {
            this.subscriptions.push(routeSubscription);
        }
    }

    openDeleteModal(member: User){
        this.selectedMember = member;
        this.showModal= true;
    }


    closeModal() {
        this.showModal = false;
        this.selectedMember = null;
    }

    confirmDelete() {
        if (this.selectedMember) {
            const memberId = this.selectedMember.id.toString();
            this.projectService.removeMember(this.projectId, memberId).subscribe(() => {
                this.toastService.showToast('success', 'Member removed successfully');
                this.project$ = this.projectService.getProjectById(this.projectId);
                this.closeModal();
            });
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    removeMember(index: number) {
        const projectSubscription = this.project$?.subscribe(project => {
            const memberId = project.members[index].id.toString();
            this.projectService.removeMember(this.projectId, memberId).subscribe(() => {
                this.toastService.showToast('success', 'Member removed successfully');
                this.project$ = this.projectService.getProjectById(this.projectId);
            });
        });

        if (projectSubscription) {
            this.subscriptions.push(projectSubscription);
        }
    }
}
