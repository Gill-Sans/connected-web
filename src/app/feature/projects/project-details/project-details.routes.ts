import {Routes} from '@angular/router';
import {ProjectDetailsComponent} from './project-details.component';
import {FeedbackComponent} from './components/feedback/feedback.component';
import {MembersComponent} from './components/members/members.component';
import {ApplicationsComponent} from './components/applications/applications.component';
import {DetailsOverviewComponent} from './components/details-overview/details-overview.component';
import {ProjectUpdateComponent} from '../project-update/project-update.component';

// route for the detailspage and its childroutes
export const projectDetailsRoutes: Routes = [
    {
        path: ':id',
        component: ProjectDetailsComponent,
        children: [
            {path: 'overview', component: DetailsOverviewComponent},
            {path: 'feedback', component: FeedbackComponent},
            {path: 'members', component: MembersComponent},
            {path: 'applications', component: ApplicationsComponent},
            {path: 'edit', component: ProjectUpdateComponent},
            {path: '', redirectTo: 'overview', pathMatch: 'full'}
        ]
    }


];
