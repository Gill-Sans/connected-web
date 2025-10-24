import { Component, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { BugService } from '../services/bug.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-bug-report',
    imports: [FormsModule, ButtonComponent],
    templateUrl: './bug-report.component.html',
    styleUrls: ['./bug-report.component.scss']
})
export class BugReportComponent {
    private readonly bugs = inject(BugService);

    showForm = false;
    message = '';
    sending = false;

    toggleForm() { this.showForm = !this.showForm; }

    submit() {
        const description = this.message.trim();
        if (!description) return;

        this.sending = true;

        this.bugs.create({
            description,
            route: window.location.pathname + window.location.search,
            appVersion: environment.appVersion
        }).subscribe({
            next: () => {
                this.sending = false;
                this.message = '';
                this.showForm = false;
            },
            error: () => { this.sending = false; }
        });
    }
}
