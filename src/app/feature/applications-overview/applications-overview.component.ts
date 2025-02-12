import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StatuscardComponent} from '../../shared/components/statuscard/statuscard.component';
import {Router} from '@angular/router';

@Component({
    selector: 'app-applications-overview',
    imports: [CommonModule, StatuscardComponent],
    templateUrl: './applications-overview.component.html',
    styleUrl: './applications-overview.component.scss'
})
export class ApplicationsOverviewComponent {
    private router = inject(Router);
    applications = [{
        first_name: "Steve",
        last_name: "van der Beek",
        project: "ConnectEd",
        status: "Pending",
        image: "icons/placeholderpic.svg"
    },
        {
            first_name: "Wim",
            last_name: "van der Beek",
            project: "ConnectEd",
            status: "Approved",
            image: "icons/placeholderpic.svg"
        },
        {
            first_name: "Lucas",
            last_name: "Lebron",
            project: "ConnectEd",
            status: "Rejected",
            image: "icons/placeholderpic.svg"
        }
    ]

    navigateToApplication(application: any) {
        // Vervang '/application' met je gewenste route
        this.router.navigate(['/application', application.id]);
        // Voor nu loggen we alleen
        console.log('Navigating to application:', application);
    }
}
