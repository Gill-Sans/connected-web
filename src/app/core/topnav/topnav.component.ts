import { Component } from '@angular/core';

@Component({
  selector: 'app-topnav',
  imports: [],
  templateUrl: './topnav.component.html',
  styleUrl: './topnav.component.scss'
})
export class TopnavComponent {
  isHidden = true;

  toggleHidden() {
    this.isHidden = !this.isHidden
  }
}
