import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ButtonComponent} from '../../shared/components/button/button.component';

@Component({
    selector: 'app-project-details',
    imports: [CommonModule, RouterModule, ButtonComponent],
    templateUrl: './project-details.component.html',
    styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent {

}
