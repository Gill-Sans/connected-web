import { Component, Input } from '@angular/core';
import { TagcardComponent } from '../tagcard/tagcard.component';
import { CommonModule } from '@angular/common';
import { tag } from '../models/tag.model';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-projectcard',
  imports: [TagcardComponent, CommonModule,RouterModule],
  templateUrl: './projectcard.component.html',
  styleUrl: './projectcard.component.scss'
})
export class ProjectcardComponent {
  @Input() title: string = 'placeholder';
  @Input() description: string = 'placeholder';
  @Input() tags: tag[] = [{ id: 0, name: 'placeholder' }];  // Changed to tag[]
  @Input() id!: number;

  constructor(private router: Router) { }

  navigateToProject(){
    this.router.navigate(['/projects', this.id]);
  }
}
