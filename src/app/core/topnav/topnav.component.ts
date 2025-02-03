import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {AuthFacade} from '../../auth/store/auth.facade';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-topnav',
  imports: [
    CommonModule
  ],
  templateUrl: './topnav.component.html',
  styleUrl: './topnav.component.scss'
})
export class TopnavComponent {
  isHidden = true;
  private readonly authFacade = inject(AuthFacade);
  readonly user$ = this.authFacade.user$;

  toggleHidden() {
    this.isHidden = !this.isHidden
  }
}
