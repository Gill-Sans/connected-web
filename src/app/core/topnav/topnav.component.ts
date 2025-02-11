import {AuthFacade} from '../../auth/store/auth.facade';
import {CommonModule} from '@angular/common';
import {inject, Component} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Role } from '../../auth/models/role.model';

@Component({
  selector: 'app-topnav',
  imports: [
    CommonModule
  ],
  templateUrl: './topnav.component.html',
  styleUrl: './topnav.component.scss'
})
export class TopnavComponent {
  public Role = Role;

  isHidden = true;
  isHiddenProfile= true;
  private readonly authFacade = inject(AuthFacade);
  readonly user$ = this.authFacade.user$;
  private readonly router = inject(Router);

  toggleHidden() {this.isHidden = !this.isHidden}

  toggleHiddenprofile(){this.isHiddenProfile = !this.isHiddenProfile}

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  logout(){
    console.log('logout!');
  }
}