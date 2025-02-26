import { CommonModule } from '@angular/common';
import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { AuthFacade } from '../../auth/store/auth.facade';
import { User } from '../../auth/models/user.model';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TagcardComponent } from '../../shared/components/tagcard/tagcard.component';
import { UserService } from '../../core/services/user.service';
import { FormsModule } from '@angular/forms';
import { tag } from '../../shared/models/tag.model';
import { TagSearchComponentComponent } from '../../shared/tag-search-component/tag-search-component.component';
import { ToastService } from '../../core/services/toast.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-profilepage',
    imports: [CommonModule, ButtonComponent, FormsModule, TagSearchComponentComponent, TagcardComponent],
    templateUrl: './profilepage.component.html',
    styleUrl: './profilepage.component.scss'
})
export class ProfilepageComponent implements OnInit, OnDestroy {
    user: User | null = null;
    tag: tag | null = null;
    isEditing = false;
    loading = false;
    private readonly authFacade = inject(AuthFacade);
    private readonly toastService: ToastService = inject(ToastService);
    readonly user$ = this.authFacade.user$;
    newTag: string = '';
    showTagInput: boolean = false;
    private currentUser: User | null = null;
    private subscriptions: Subscription[] = [];

    constructor(
        private userService: UserService
    ) {
    }

    ngOnInit() {
        const userSubscription = this.authFacade.user$.subscribe(user => {
            this.currentUser = user;
            if (user != null) {
                const userDetailsSubscription = this.userService.getUserProfile(user.id).subscribe(userDetails => {
                    this.user = userDetails;
                });
                this.subscriptions.push(userDetailsSubscription);
            }
        });
        this.subscriptions.push(userSubscription);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    get canEditProfile(): boolean {
        return this.user?.id === this.currentUser?.id;
    }

    addTagToUser(selectedTag: tag) {
        if (!this.user || !this.user.tags) return;

        if (!this.user.tags.some(t => t.id === selectedTag.id)) {
            this.user.tags?.push(selectedTag);
        }
    }

    removeTag(tagIdToRemove: number) {
        if (!this.user?.tags) return;

        this.user.tags = this.user.tags.filter(tag => tag.id !== tagIdToRemove);
    }

    saveProfile() {
        if (!this.user) return;

        this.loading = true;

        const updatedUser: Partial<User> = {
            id: this.user.id,
            aboutMe: this.user.aboutMe,
            fieldOfStudy: this.user.fieldOfStudy,
            linkedinUrl: this.user.linkedinUrl,
            tags: this.user.tags
        };

        this.userService.updateUserProfile(updatedUser).subscribe(
            updatedUser => {
                this.user = updatedUser;
                this.isEditing = false;
                this.loading = false;
                this.toastService.showToast('success', 'Profile updated successfully');
            },
            error => {
                console.error('Error updating profile:', error);
                this.loading = false;
                this.toastService.showToast('error', 'Error updating profile');
            }
        );
    }
}
