import {CommonModule} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {AuthFacade} from '../../auth/store/auth.facade';
import {User} from '../../auth/models/user.model';
import {ButtonComponent} from '../../shared/components/button/button.component';
import {TagcardComponent} from '../../shared/components/tagcard/tagcard.component';
import {UserService} from '../../core/services/user.service';
import {FormsModule} from '@angular/forms';
import {tag} from '../../shared/models/tag.model';
import {TagSearchComponentComponent} from '../../shared/tag-search-component/tag-search-component.component';

@Component({
  selector: 'app-profilepage',
  imports: [CommonModule,ButtonComponent,FormsModule,TagSearchComponentComponent,TagcardComponent],
  templateUrl: './profilepage.component.html',
  styleUrl: './profilepage.component.scss'
})
export class ProfilepageComponent implements OnInit {
  user: User | null = null;
  tag: tag | null = null;
  isEditing = false;
  private readonly authFacade = inject(AuthFacade);
  readonly user$ = this.authFacade.user$;
  newTag: string = '';
  showTagInput: boolean = false;
  private currentUser: User | null = null;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.authFacade.user$.subscribe(user => {
      this.currentUser = user;
      if(user != null){
      this.userService.getUserProfile(user.id).subscribe(userDetails => {
        this.user = userDetails;
      });
    } else{
      console.log("ingelogde user vanuit state: " , user);
    }
    })
  }
  

  get canEditProfile(): boolean {
  
    return this.user?.id === this.currentUser?.id;

  }

  addTagToUser(selectedTag:tag) {
    if(!this.user || !this.user.tags) return;

    if(this.user){
      this.user.tags = [];
    }

   if(!this.user.tags.some(t => t.name === this.newTag)){
    this.user.tags?.push(selectedTag);
  }
}


  removeTag(tagIdToRemove: number) {
    if (!this.user?.tags) return;

    // Filter de specifieke tag eruit
    // Update de user tags
    this.user.tags = this.user.tags.filter(tag => tag.id !== tagIdToRemove);
  }


  //save the user profile
  saveProfile(){
    if(!this.user) return;

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
        console.log("Profile updated successfully:", updatedUser);
      },
      error => {
        console.error('Error updating profile:', error);
      }
    );
  }
}
