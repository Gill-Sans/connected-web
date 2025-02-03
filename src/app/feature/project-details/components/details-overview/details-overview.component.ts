import { Component } from '@angular/core';
import { LinkcardComponent } from '../../../../shared/linkcard/linkcard.component';
import { first } from 'rxjs';
import { CommonModule } from '@angular/common';
import {MarkdownModule } from 'ngx-markdown';
//TODO: add check if image of user is empty --> placeholderpic.svg
@Component({
  selector: 'app-details-overview',
  imports: [LinkcardComponent, CommonModule,MarkdownModule],
  templateUrl: './details-overview.component.html',
  styleUrl: './details-overview.component.scss'
})
export class DetailsOverviewComponent {
//NOTE: als een tab inzet voor de markdown, dan wordt de markdown niet goed weergegeven
  project = {
    title: 'ProjectConnect',
    description: 
`# Doel van de applicatie

**ProjectConnect** heeft als doel projectvoorstellen binnen te krijgen voor *studiegerelateerde projecten* met **deadlines**.  
De applicatie biedt een intuïtieve interface waarmee docenten deze voorstellen kunnen beoordelen en goed- of afkeuren.
### Functionaliteiten:
1. **Projectindiening en deadlinebeheer**
- Studenten kunnen eenvoudig projectvoorstellen indienen
- Inclusief projectbeschrijving en vereiste vaardigheden
2. **Docentenbeoordeling en goedkeuring**
- Docenten kunnen ingediende voorstellen inzien en beoordelen
- Feedback kan worden toegevoegd voor indieners
3. **Sollicitatieproces**
- Studenten kunnen solliciteren op projecten naar keuze
- Notificaties bij selectie of afwijzing

4. **Teamwerving door project pitchers**
- Pitchers kunnen studenten uitnodigen voor hun team
- Sollicitaties worden beoordeeld en teamleden geselecteerd`
  };


  members = [
    {first_name : 'John', last_name: 'Doe', image: 'icons/placeholderpic.svg'},
    {first_name : 'Jane', last_name: 'Doe', image: 'icons/placeholderpic.svg'},
  ]

}
