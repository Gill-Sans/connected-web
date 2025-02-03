import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-linkcard',
  imports: [CommonModule],
  templateUrl: './linkcard.component.html',
  styleUrl: './linkcard.component.scss'
})
export class LinkcardComponent {
  links = [
    { url: 'https://www.youtube.com/watch?v=xvFZjo5PgG0', icon: 'icons/Github.svg', alt: 'Github Link' },
    { url: 'https://www.youtube.com/watch?v=xvFZjo5PgG0', icon: 'icons/Trello.svg', alt: 'Trello Link' },
  ];
}
