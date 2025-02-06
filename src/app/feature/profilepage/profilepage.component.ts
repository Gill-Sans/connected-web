import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthFacade } from '../../auth/store/auth.facade';
import { ButtonComponent } from '../../shared/button/button.component';
import { TagcardComponent } from '../../shared/tagcard/tagcard.component';

@Component({
  selector: 'app-profilepage',
  imports: [CommonModule,ButtonComponent,TagcardComponent],
  templateUrl: './profilepage.component.html',
  styleUrl: './profilepage.component.scss'
})
export class ProfilepageComponent {
  private readonly authFacade = inject(AuthFacade);
  readonly user$ = this.authFacade.user$;


  userImage: string | null = null; 
  about_me = 'I am a software engineer';
  first_name = 'thomas'
  last_name = 'steven';
  linkedinUrl = 'https://www.linkedin.com/in/steven-steven/';
  skills = ['Java', 'Angular', 'Spring Boot'];





}
