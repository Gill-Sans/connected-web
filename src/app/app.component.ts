import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { TopnavComponent } from './shared/topnav/topnav.component';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';

import { ProjectOverviewComponent } from './feature/project-overview/project-overview.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidenavComponent, TopnavComponent,FormsModule, LMarkdownEditorModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'connected-web';
}