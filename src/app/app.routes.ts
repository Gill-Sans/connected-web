import {Routes} from '@angular/router';
import {ProjectOverviewComponent} from './feature/project-overview/project-overview.component';
import {LoginComponent} from './auth/login/login.component';
import {MainLayoutComponent} from './feature/main-layout/main-layout.component';
import {AuthGuard} from './auth/guards/auht.guard';
import {AuthLayoutComponent} from './feature/auth-layout/auth-layout.component';
import {ProjectCreateComponent} from './feature/project-create/project-create.component';
import {projectDetailsRoutes} from './feature/project-details/project-details.routes';
import {CourseOverviewComponent} from './feature/courses/course-overview/course-overview.component';
import {ProfilepageComponent} from './feature/profilepage/profilepage.component';
import {ApplicationsOverviewComponent} from './feature/applications-overview/applications-overview.component';
import {DashboardComponent} from './feature/dashboard/dashboard.component';
import {ActiveAssignmentResolver} from './core/services/active-assignment-resolver.service';
import {WelcomeComponent} from './feature/welcome/welcome.component';
import {NotfoundComponent} from './feature/notfound/notfound.component';

export const routes: Routes = [
    {
        // Authenticated routes
        path: '',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            // Routes that do NOT require an active assignment context:
            { path: 'courses', component: CourseOverviewComponent },
            { path: 'profile', component: ProfilepageComponent },
            { path: '', component: WelcomeComponent },
            { path: '404', component: NotfoundComponent },

            // Routes that DO require an active assignment context:
            {
                path: ':courseSlug/:assignmentSlug',
                resolve: { activeAssignment: ActiveAssignmentResolver },
                children: [
                    {path: 'dashboard', component: DashboardComponent},
                    { path: 'projects', component: ProjectOverviewComponent },
                    { path: 'projects/create', component: ProjectCreateComponent },
                    { path: 'projects/:id', children: projectDetailsRoutes },
                    { path: 'applications', component: ApplicationsOverviewComponent },
                    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
                ]
            }
        ]
    },
    {
        // Unauthenticated routes
        path: 'login',
        component: AuthLayoutComponent,
        children: [
            {path: '', component: LoginComponent}
        ]
    },
    {path: '**', redirectTo: ''}
];
