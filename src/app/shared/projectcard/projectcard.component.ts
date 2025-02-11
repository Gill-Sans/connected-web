import { Component, Input } from '@angular/core';
import { TagcardComponent } from '../tagcard/tagcard.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projectcard',
  imports: [TagcardComponent, CommonModule],
  templateUrl: './projectcard.component.html',
  styleUrl: './projectcard.component.scss'
})
export class ProjectcardComponent {
  @Input() id!: number;
  @Input() title!: string;
  @Input() description!: string;
  @Input() tags!: string[];

  constructor(private router: Router) { }

  navigateToProject() {
    this.router.navigate(['/projects', this.id]);
  }
}
