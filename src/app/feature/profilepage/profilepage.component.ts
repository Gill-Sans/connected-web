import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AuthFacade } from '../../auth/store/auth.facade';
import { FormsModule } from '@angular/forms'; 

import { ButtonComponent } from '../../shared/button/button.component';
import { TagcardComponent } from '../../shared/tagcard/tagcard.component';
import { UserService } from '../../core/services/user.service';
import { switchMap } from 'rxjs';
import { User } from '../../auth/models/user.model';

@Component({
  selector: 'app-profilepage',
  imports: [CommonModule,
            ButtonComponent,
            TagcardComponent,
            FormsModule
  ],
  templateUrl: './profilepage.component.html',
  styleUrls: ['./profilepage.component.scss']
})
export class ProfilepageComponent implements OnInit {
  user: User | null = null;
  isEditing = false;
  aboutMe: string = '';
  fieldOfStudy: string = '';
  linkedinUrl: string = '';
  private readonly authFacade = inject(AuthFacade);
  readonly user$ = this.authFacade.user$;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.authFacade.user$.subscribe(user => {
      if (user) {
        this.userService.getUserProfile(user.id).subscribe(userDetails => {
          this.user = userDetails;
          this.aboutMe = userDetails.aboutMe || '';
          this.fieldOfStudy = userDetails.fieldOfStudy || '';
          this.linkedinUrl = userDetails.linkedinUrl || '';
        });
        console.log("Ingelogde user vanuit state:", user);
      } else {
        console.error("User is null");
      }
    });
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
  }

  saveProfile() {
    if (!this.user) return;

    this.user.aboutMe = this.aboutMe;
    this.user.fieldOfStudy = this.fieldOfStudy;
    this.user.linkedinUrl = this.linkedinUrl;

    const observer = {
      next: (response: User) => {
        console.log('Profile updated:', response);
        this.isEditing = false;
      },
      error: (error: any) => {
        console.error('Error updating profile:', error);
      }
    };

    this.userService.updateUserProfile(this.user).subscribe(observer);
  }
}