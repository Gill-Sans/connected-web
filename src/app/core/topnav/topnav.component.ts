import {AuthFacade} from '../../auth/store/auth.facade';
import {CommonModule} from '@angular/common';
import {inject, Component} from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '../../auth/models/role.model';
import {ClickOutsideDirective} from '../../shared/directives/click-outside.directive';

@Component({
  selector: 'app-topnav',
  imports: [
    CommonModule,
    ClickOutsideDirective
  ],
  templateUrl: './topnav.component.html',
  styleUrl: './topnav.component.scss'
})
export class TopnavComponent {
  public Role = Role;
  isHiddenAssignments = true;
  isHiddenProfile = true;

  private readonly authFacade = inject(AuthFacade);
  readonly user$ = this.authFacade.user$;
  private readonly router = inject(Router);

  toggleAssignmentsHidden() {
    this.isHiddenAssignments = !this.isHiddenAssignments;
  }

  closeAssignmentsDropdown() {
    this.isHiddenAssignments = true;
  }

  toggleHiddenprofile() {
    this.isHiddenProfile = !this.isHiddenProfile;
  }

  // This method is called when a click is detected outside the dropdown.
  closeProfileDropdown() {
    this.isHiddenProfile = true;
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    console.log('logout!');
  }
}
