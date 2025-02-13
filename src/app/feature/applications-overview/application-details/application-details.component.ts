import { Component, inject } from '@angular/core';
import { ApplicationService } from '../../../core/services/application.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-application-details',
  imports: [CommonModule],
  templateUrl: './application-details.component.html',
  styleUrl: './application-details.component.scss'
})
export class ApplicationDetailsComponent {
  private readonly applicationService = inject(ApplicationService);
  private readonly route = inject(ActivatedRoute);
  applicationId = this.route.snapshot.params['id'];
  application$ = this.applicationService.getApplication(this.applicationId);

  ngOnInit() {
    this.application$.subscribe(application => {
      console.log('Application:', application);
    });
  }

}
