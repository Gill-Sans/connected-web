import {Routes} from '@angular/router';
import {ResearcherGuard} from '../../core/guards/researcher.guard';
import {TeacherGuard} from '../../core/guards/teacher.guard';
import {ActiveAssignmentResolver} from '../../core/services/active-assignment-resolver.service';

const loadCourseOverview = () => import('../courses/course-overview/course-overview.component').then(m => m.CourseOverviewComponent);
const loadProfilePage = () => import('../profilepage/profilepage.component').then(m => m.ProfilepageComponent);
const loadWelcome = () => import('../welcome/welcome.component').then(m => m.WelcomeComponent);
const loadNotFound = () => import('../notfound/notfound.component').then(m => m.NotfoundComponent);
const loadSettings = () => import('../settings/settings.component').then(m => m.SettingsComponent);
const loadDashboard = () => import('../dashboard/dashboard.component').then(m => m.DashboardComponent);
const loadApplicationsOverview = () => import('../applications-overview/applications-overview.component').then(m => m.ApplicationsOverviewComponent);
const loadApplicationDetails = () => import('../applications-overview/application-details/application-details.component').then(m => m.ApplicationDetailsComponent);
const loadApplicationCreate = () => import('../applications-create/applications-create.component').then(m => m.ApplicationsCreateComponent);
const loadDeadlineOverview = () => import('../deadlines/deadline-overview/deadline-overview.component').then(m => m.DeadlineOverviewComponent);
const loadStudentOverview = () => import('../student-overview/student-overview.component').then(m => m.StudentOverviewComponent);
const loadAnnouncementsOverview = () => import('../announcements/announcement-overview/announcement-overview.component').then(m => m.AnnouncementOverviewComponent);
const loadAnnouncementCreate = () => import('../announcements/announcement-create/announcement-create.component').then(m => m.AnnouncementCreateComponent);

export const MAIN_ROUTES: Routes = [
    {
        path: 'courses',
        canActivate: [TeacherGuard],
        title: 'Course overview - ConnectEd',
        loadComponent: loadCourseOverview
    },
    {
        path: 'profile',
        title: 'My Profile - ConnectEd',
        loadComponent: loadProfilePage
    },
    {
        path: '',
        loadComponent: loadWelcome
    },
    {
        path: '404',
        title: '404 Not Found - ConnectEd',
        loadComponent: loadNotFound
    },
    {
        path: 'settings',
        title: 'App Settings - ConnectEd',
        loadComponent: loadSettings
    },
    {
        path: 'dashboard',
        title: 'Dashboard - ConnectEd',
        canActivate: [ResearcherGuard],
        loadComponent: loadDashboard
    },
    {
        path: 'projects',
        title: 'Projects - ConnectEd',
        canActivate: [ResearcherGuard],
        loadChildren: () => import('../projects/project.routes').then(m => m.PROJECT_ROUTES)
    },
    {
        path: 'course/:courseSlug/assignment/:assignmentSlug',
        resolve: {activeAssignment: ActiveAssignmentResolver},
        children: [
            {path: 'dashboard', loadComponent: loadDashboard},
            {path: 'projects', loadChildren: () => import('../projects/project.routes').then(m => m.PROJECT_ROUTES)},
            {path: 'deadlines', loadComponent: loadDeadlineOverview},
            {path: 'applications', loadComponent: loadApplicationsOverview},
            {path: 'applications/:id', loadComponent: loadApplicationDetails},
            {path: 'students', canActivate: [TeacherGuard], loadComponent: loadStudentOverview},
            {path: 'announcements', canActivate: [TeacherGuard], loadComponent: loadAnnouncementsOverview},
            {path: 'announcements/create', canActivate: [TeacherGuard], loadComponent: loadAnnouncementCreate},
            {path: 'projects/:id/apply', loadComponent: loadApplicationCreate},
            {path: '', redirectTo: 'dashboard', pathMatch: 'full'}
        ]
    }
];
