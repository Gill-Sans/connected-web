import {Component} from '@angular/core';
import {StatuscardComponent} from '../../../../shared/components/statuscard/statuscard.component';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-applications',
    imports: [StatuscardComponent, CommonModule],
    templateUrl: './applications.component.html',
    styleUrl: './applications.component.scss'
})
export class ApplicationsComponent {

    applications = [
        {first_name: "Steven", role: "Developer", status: "Pending", image: "icons/placeholderpic.svg"},
        {first_name: "Wim", role: "Scrum Master", status: "Approved", image: "icons/placeholderpic.svg"},
        {first_name: "Lucas", role: "Developer", status: "Rejected", image: "icons/placeholderpic.svg"}
    ];
}
