import { Routes } from '@angular/router';
import { ProjectOverviewComponent } from './feature/projects/project-overview/project-overview.component';
import { LoginComponent } from './auth/components/login/login.component';
import { MainLayoutComponent } from './feature/main-layout/main-layout.component';
import { AuthGuard } from './auth/guards/auht.guard';
import { AuthLayoutComponent } from './feature/auth-layout/auth-layout.component';
import { ProjectCreateComponent } from './feature/projects/project-create/project-create.component';
import { projectDetailsRoutes } from './feature/projects/project-details/project-details.routes';
import { CourseOverviewComponent } from './feature/courses/course-overview/course-overview.component';
import { ProfilepageComponent } from './feature/profilepage/profilepage.component';
import { ApplicationsOverviewComponent } from './feature/applications-overview/applications-overview.component';
import { DashboardComponent } from './feature/dashboard/dashboard.component';
import { ActiveAssignmentResolver } from './core/services/active-assignment-resolver.service';
import { WelcomeComponent } from './feature/welcome/welcome.component';
import { NotfoundComponent } from './feature/notfound/notfound.component';
import { ApplicationDetailsComponent } from './feature/applications-overview/application-details/application-details.component';
import { ApplicationsCreateComponent } from './feature/applications-create/applications-create.component';
import {DeadlineOverviewComponent} from './feature/deadline-overview/deadline-overview.component';
import {DeadlineCreateComponent} from './feature/deadline-create/deadline-create.component';
import {StudentOverviewComponent} from './feature/student-overview/student-overview.component';
import {PasswordLoginComponent} from './auth/components/password-login/password-login.component';
import {RegisterComponent} from './auth/components/register/register.component';
import {SettingsComponent} from './feature/settings/settings.component';
import {ResearcherGuard} from './core/guards/researcher.guard';
import {AnnouncementCreateComponent} from './feature/announcements/announcement-create/announcement-create.component';
import {
    AnnouncementOverviewComponent
} from './feature/announcements/announcement-overview/announcement-overview.component';

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
            { path: 'settings', component: SettingsComponent},
            { path: 'dashboard', canActivate: [ResearcherGuard], component: DashboardComponent },
            {
                path: 'projects',
                canActivate: [ResearcherGuard],
                children: [
                    { path: '', component: ProjectOverviewComponent },
                    { path: 'create', component: ProjectCreateComponent },
                    { path: '', children: projectDetailsRoutes },
                    // You can add more researcher-specific routes here (like dashboard) if needed.
                ]
            },

            // Routes that DO require an active assignment context:
            {
                path: 'course/:courseSlug/assignment/:assignmentSlug',
                resolve: { activeAssignment: ActiveAssignmentResolver },
                children: [
                    { path: 'dashboard', component: DashboardComponent },
                    { path: 'projects', component: ProjectOverviewComponent },
                    { path: 'projects/create', component: ProjectCreateComponent },
                    { path: 'projects', children: projectDetailsRoutes },
                    { path: 'projects/:id/apply', component: ApplicationsCreateComponent },
                    { path: 'deadlines', component: DeadlineOverviewComponent },
                    { path: 'deadlines/create', component: DeadlineCreateComponent },
                    { path: 'applications', component: ApplicationsOverviewComponent },
                    { path: 'applications/:id', component: ApplicationDetailsComponent },
                    { path: 'students', component: StudentOverviewComponent },
                    {path: 'announcements', component: AnnouncementOverviewComponent },
                    { path: 'announcements/create', component: AnnouncementCreateComponent },
                    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
                ]
            }
        ]
    },
    {
        // Unauthenticated routes
        path: '',
        component: AuthLayoutComponent,
        children: [
            // Default route: canvas login page.
            { path: 'login', component: LoginComponent },
            // Password login for researchers.
            { path: 'guest', component: PasswordLoginComponent },
            // Register route (special registration logic for researchers).
            { path: 'register', component: RegisterComponent }
        ]
    },
    { path: '**', redirectTo: '' }
];
