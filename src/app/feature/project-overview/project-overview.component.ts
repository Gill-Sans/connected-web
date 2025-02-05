import { Component } from '@angular/core';
import { ProjectcardComponent } from '../../shared/projectcard/projectcard.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-project-overview',
  imports: [ProjectcardComponent, CommonModule, RouterOutlet],
  templateUrl: './project-overview.component.html',
  styleUrl: './project-overview.component.scss'
})
export class ProjectOverviewComponent {

  tabOptions = [
    { label: 'All projects', value: 'all' },
    { label: 'Recommended projects', value: 'recommended' },
    { label: 'Crossover projects', value: 'crossover' }
  ];

  selectedTab: string = 'all';

  projects = [{
    title: 'yuyu',
    description: 'ProjectConnect is an application with the aim of collecting project proposals and matching students with the right project for themProjectConnect is an application with the aim of collecting project proposals and matching students with the right project for them',
    tags: ['frontend', 'Laravel', 'Python']},
    {
    title: 'Een project met een hele lange naam die ik niet zelf kan en wil bedenken maar toch zal moeten',
    description: 'ProjectConnect is an application with the aim of collecting project ',
    tags: ['frontend', 'Laravel', 'Python']},
    {
    title: 'ProjectConnect',
    description: 'ProjectConnect is an application with the aim of collecting project proposals and matching students with the right project for themProjectConnect is an application with the aim of collecting project proposals and matching students with the right project for them ProjectConnect is an application with the aim of collecting project proposals and matching students with the right project for themProjectConnect is an application with the aim of collecting project proposals and matching students with the right project for them',
    tags: ['frontend', 'Laravel', 'Python']},
    {
      title: 'ProjectConnect',
      description: 'ProjectConnect is an application with the aim of collecting project proposals and matching students with the right project for themProjectConnect is an application with the aim of collecting project proposals and matching students with the right project for them is an application with the aim of collecting project proposals and matching students with the right project for them',
      tags: ['frontend', 'Laravel', 'Python']},
    {
    title: 'ProjectConnect',
    description: 'ProjectConnect is an application with the aim of collecting project proposals and matching students with the right project for themProjectConnect is an application with the aim of collecting project proposals and matching students with the right project for them',
    tags: ['frontend', 'Laravel', 'Python']},
    {
      title: 'ProjectConnect',
      description: 'ProjectConnect is an applProjectConnect is an application with the aim of collecting project proposals and matching students with the right project for themProjectConnect is an application with the aim of collecting project proposals and matching students with the right project for themProjectConnect is an application with the aim of collecting project proposals and matching students with the right project for themProjectConnect is an application with the aim of collecting project proposals and matching students with the right project for themh the right project for them',
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

  changeTab(tab: string) {
    this.selectedTab = tab;
  }

}
