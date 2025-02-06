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
    title: 'Project connect',
    description: 'ProjectConnect is an application with the aim of collecting project proposals and matching students with the right project for themProjectConnect is an application with the aim of collecting project proposals and matching students with the right project for them',
    tags: ['frontend', 'Laravel', 'Python']},
    {
    title: 'Een project met een hele lange naam die ik niet zelf kan en wil bedenken maar toch zal moeten',
    description: 'ProjectConnect is an application with the aim of collecting project ',
    tags: ['frontend', 'Laravel', 'Python']},
    {
      title: 'AI Image Recognition',
      description: 'Developing a new AI algorithm to improve image recognition accuracy using deep learning techniques and large datasets.',
      tags: ['AI', 'Machine Learning', 'Python']
    },
    {
      title: 'Personal Finance Manager',
      description: 'Creating a mobile application for managing personal finances, budgeting, and tracking expenses with real-time updates.',
      tags: ['Mobile', 'Finance', 'React Native']
    },
    {
      title: 'Scalable E-commerce Platform',
      description: 'Building a scalable e-commerce platform with advanced search capabilities, user-friendly interface, and secure payment options.',
      tags: ['E-commerce', 'Node.js', 'MongoDB']
    },
    {
      title: 'Real-time Chat Application',
      description: 'Developing a real-time chat application with end-to-end encryption, group chat support, and multimedia sharing features.',
      tags: ['Chat', 'Real-time', 'WebSocket']
    },
    {
      title: 'Blockchain in Supply Chain',
      description: 'Exploring the potential of blockchain technology in supply chain management to enhance transparency and traceability.',
      tags: ['Blockchain', 'Supply Chain', 'Ethereum']
    },
    {
      title: 'Virtual Reality Education',
      description: 'Creating a virtual reality experience for educational purposes, including interactive lessons and immersive simulations.',
      tags: ['VR', 'Education', 'Unity']
    },
    {
      title: 'Cloud Data Analytics',
      description: 'Developing a cloud-based solution for data analytics and visualization, enabling real-time insights and reporting.',
      tags: ['Cloud', 'Data Analytics', 'AWS']
    },
    {
      title: 'Social Media for Creators',
      description: 'Building a social media platform with unique features for content creators, including monetization options and analytics tools.',
      tags: ['Social Media', 'Content Creation', 'Angular']
    },
    {
      title: 'Smart Home System',
      description: 'Designing a smart home system that integrates with various IoT devices for automation and remote control.',
      tags: ['IoT', 'Smart Home', 'Raspberry Pi']
    },
    {
      title: 'NLP Open Source Library',
      description: 'Creating an open-source library for natural language processing tasks, including text classification and sentiment analysis.',
      tags: ['NLP', 'Open Source', 'JavaScript']
    }
  ];

  changeTab(tab: string) {
    this.selectedTab = tab;
  }

}
