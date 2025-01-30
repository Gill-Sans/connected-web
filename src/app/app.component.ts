import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { TopnavComponent } from './shared/topnav/topnav.component';

import { ProjectOverviewComponent } from './feature/project-overview/project-overview.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidenavComponent, TopnavComponent, ProjectOverviewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'connected-web';
}
