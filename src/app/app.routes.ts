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
import {DeadlineOverviewComponent} from './feature/deadlines/deadline-overview/deadline-overview.component';
import {StudentOverviewComponent} from './feature/student-overview/student-overview.component';
import {PasswordLoginComponent} from './auth/components/password-login/password-login.component';
import {RegisterComponent} from './auth/components/register/register.component';
import {SettingsComponent} from './feature/settings/settings.component';
import {ResearcherGuard} from './core/guards/researcher.guard';
import {AnnouncementCreateComponent} from './feature/announcements/announcement-create/announcement-create.component';
import {
    AnnouncementOverviewComponent
} from './feature/announcements/announcement-overview/announcement-overview.component';
import {TeacherGuard} from './core/guards/teacher.guard';
import {EmailVerifiedGuard} from './auth/guards/email-verified.guard';
import {VerifyEmailComponent} from './feature/verify-email/verify-email/verify-email.component';
import {VerifyTokenComponent} from './feature/verify-email/verify-token/verify-token.component';
import {AlreadyAuthGuard} from './auth/guards/already-auth.guard';
import {AlreadyVerifiedGuard} from './auth/guards/already-verified.guard';

export const routes: Routes = [
    {
        // Authenticated routes
        path: '',
        title: 'ConnectEd - Assemble Student Teams with Ease',
        component: MainLayoutComponent,
        canActivate: [AuthGuard, EmailVerifiedGuard],
        children: [
            // Routes that do NOT require an active assignment context:
            { path: 'courses', canActivate: [TeacherGuard], title: 'Course overview - ConnectEd', component: CourseOverviewComponent },
            { path: 'profile', title: 'My Profile - ConnectEd', component: ProfilepageComponent },
            { path: '', component: WelcomeComponent },
            { path: '404', title: '404 Not Found - ConnectEd',  component: NotfoundComponent },
            { path: 'settings', title: 'App Settings - ConnectEd', component: SettingsComponent},
            { path: 'dashboard', title: 'Dashboard - ConnectEd',  canActivate: [ResearcherGuard], component: DashboardComponent },
            {
                path: 'projects',
                title: 'Projects - ConnectEd',
                canActivate: [ResearcherGuard],
                children: [
                    { path: '', component: ProjectOverviewComponent },
                    { path: 'create', component: ProjectCreateComponent },
                    { path: '', children: projectDetailsRoutes }
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
                    { path: 'projects', children: projectDetailsRoutes},
                    { path: 'projects/:id/apply', component: ApplicationsCreateComponent},
                    { path: 'deadlines', component: DeadlineOverviewComponent },
                    { path: 'applications', component: ApplicationsOverviewComponent },
                    { path: 'applications/:id', component: ApplicationDetailsComponent},
                    { path: 'students', canActivate: [TeacherGuard], component: StudentOverviewComponent },
                    {path: 'announcements', canActivate: [TeacherGuard],  component: AnnouncementOverviewComponent },
                    { path: 'announcements/create', canActivate: [TeacherGuard],  component: AnnouncementCreateComponent },
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
            { path: 'login', component: LoginComponent, canActivate: [AlreadyAuthGuard] },
            // Password login for researchers.
            { path: 'guest', component: PasswordLoginComponent, canActivate: [AlreadyAuthGuard] },
            // Register route (special registration logic for researchers).
            { path: 'register', component: RegisterComponent, canActivate: [AlreadyAuthGuard] },
            { path: 'verify-email', component: VerifyEmailComponent, canActivate: [AlreadyVerifiedGuard] },
            { path: 'verify', component: VerifyTokenComponent, canActivate: [AlreadyVerifiedGuard] }
        ]
    },
    { path: '**', redirectTo: '' }
];
