import { Component } from '@angular/core';
import { LinkcardComponent } from '../../../../shared/linkcard/linkcard.component';
import { first } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details-overview',
  imports: [LinkcardComponent, CommonModule],
  templateUrl: './details-overview.component.html',
  styleUrl: './details-overview.component.scss'
})
export class DetailsOverviewComponent {
  members = [
    {first_name : 'John', last_name: 'Doe', image: 'icons/placeholderpic.svg'},
    {first_name : 'Jane', last_name: 'Doe', image: 'icons/placeholderpic.svg'},
  ]

}
