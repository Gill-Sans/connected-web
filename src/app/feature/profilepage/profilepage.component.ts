import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AuthFacade } from '../../auth/store/auth.facade';

import { ButtonComponent } from '../../shared/button/button.component';
import { TagcardComponent } from '../../shared/tagcard/tagcard.component';
import { UserService } from '../../core/services/user.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-profilepage',
  imports: [CommonModule,ButtonComponent,TagcardComponent],
  templateUrl: './profilepage.component.html',
  styleUrl: './profilepage.component.scss'
})
export class ProfilepageComponent implements OnInit {
  user: any = null
  isEditing = false;
  private readonly authFacade = inject(AuthFacade);
  readonly user$ = this.authFacade.user$;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.authFacade.user$.subscribe(user =>{ 
      this.userService.getUserProfile(user.id).subscribe(userDetails => {
        this.user = userDetails;
      });
      console.log("ingelogde user vanuit state: " , user);

    })

  /* this.authFacade.getUserId().pipe(
    switchMap((id) => {
      if (id !== null) {
        console.log("Fetching user profile for ID:", id);
        return this.userService.getUserProfile(id);
      } else {
        console.error("User ID is null");
        throw new Error("User ID is null");
      }
    })
  ).subscribe(
    (data) => {
      console.log("User data ontvangen:", data);
      this.user = data;
    },
    (error) => {
      console.error('Error fetching user profile', error);
    }
  ); */
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
  }
/* 
  saveProfile() {
    if (!this.user) return;

    this.authFacade.getUserId().pipe(
      switchMap((id) => {
        if (id !== null) {
          return this.userService.updateUserProfile(id, this.user);
        } else {
          throw new Error("User ID is null");
        }
      })
    ).subscribe(
      (response) => {
        console.log('Profile updated:', response);
        this.isEditing = false;
      },
      (error) => {
        console.error('Error updating profile:', error);
      }
    );
  } */
}
