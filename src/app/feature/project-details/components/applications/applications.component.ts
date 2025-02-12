import { Component } from '@angular/core';
import { StatuscardComponent } from '../../../../shared/components/statuscard/statuscard.component';
import { CommonModule } from '@angular/common';
import { ApplicationStatusEnum } from '../../../../shared/models/ApplicationStatus.enum';
import { Application } from '../../../../shared/models/application.model';


@Component({
    selector: 'app-applications',
    imports: [CommonModule],
    templateUrl: './applications.component.html',
    styleUrl: './applications.component.scss'
})
export class ApplicationsComponent {

  applications = [
    { first_name: "Steven", role: "Developer", status: ApplicationStatusEnum.PENDING, image: "icons/placeholderpic.svg" },
    { first_name: "Wim", role: "Scrum Master", status: ApplicationStatusEnum.ACCEPTED, image: "icons/placeholderpic.svg" },
    { first_name: "Lucas", role: "Developer", status: ApplicationStatusEnum.REJECTED, image: "icons/placeholderpic.svg" }
  ];
}
