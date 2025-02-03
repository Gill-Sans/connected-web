import { Component } from '@angular/core';
import { LinkcardComponent } from '../../../../shared/linkcard/linkcard.component';
import { first } from 'rxjs';
import { CommonModule } from '@angular/common';
//TODO: add check if image of user is empty --> placeholderpic.svg
@Component({
  selector: 'app-details-overview',
  imports: [LinkcardComponent, CommonModule],
  templateUrl: './details-overview.component.html',
  styleUrl: './details-overview.component.scss'
})
export class DetailsOverviewComponent {

  project = {
    title: 'ProjectConnect',
    description: `Doel van de applicatie: ProjectConnect heeft als doel projectvoorstellen binnen te krijgen 
        voor studiegerelateerde projecten met deadlines. De applicatie biedt een intuïtieve interface 
        waarmee docenten deze voorstellen kunnen beoordelen en goed- of afkeuren. Studenten krijgen 
        de mogelijkheid om te solliciteren voor de projecten die hen interesseren. Bovendien bevat 
        ProjectConnect een module waarmee project pitchers hun teamleden kunnen 'aanwerven'.`,

  };


  members = [
    {first_name : 'John', last_name: 'Doe', image: 'icons/placeholderpic.svg'},
    {first_name : 'Jane', last_name: 'Doe', image: 'icons/placeholderpic.svg'},
  ]

}
