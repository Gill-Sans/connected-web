import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { TopnavComponent } from './shared/topnav/topnav.component';
import { ProjectcardComponent } from "./shared/projectcard/projectcard.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidenavComponent, TopnavComponent, ProjectcardComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'connected-web';

  projects = [{
    title: 'ProjectConnect',
    description: 'ProjectConnect is an application with the aim of collecting project proposals and matching students with the right project for themProjectConnect is an application with the aim of collecting project proposals and matching students with the right project for them',
    tags: ['frontend', 'Laravel', 'Python']},
    {
    title: 'ProjectConnect',
    description: 'ProjectConnect is an application with the aim of collecting project proposals and matching students with the right project for themProjectConnect is an application with the aim of collecting project proposals and matching students with the right project for them',
    tags: ['frontend', 'Laravel', 'Python']},
    {
    title: 'ProjectConnect',
    description: 'ProjectConnect is an application with the aim of collecting project proposals and matching students with the right project for themProjectConnect is an application with the aim of collecting project proposals and matching students with the right project for them',
    tags: ['frontend', 'Laravel', 'Python']}
  ];
}
