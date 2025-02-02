import { Routes } from '@angular/router';
import { ProjectDetailsComponent } from './project-details.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { MembersComponent } from './components/members/members.component';
import { ApplicationsComponent } from './components/applications/applications.component';
import { DetailsOverviewComponent } from './components/details-overview/details-overview.component';

// Define the routes for the project details feature module
export const projectDetailsRoutes: Routes = [
    {
        path: '',
        component: ProjectDetailsComponent,
        children:[
            {path: 'overview', component: DetailsOverviewComponent},
            {path: 'feedback', component: FeedbackComponent},
            {path: 'members', component: MembersComponent},
            {path: 'applications', component: ApplicationsComponent},
            {path: '', redirectTo: 'overview', pathMatch: 'full'}
        ]
    }
];