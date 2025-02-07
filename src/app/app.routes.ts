import { Routes } from '@angular/router';
import { ProjectOverviewComponent } from './feature/project-overview/project-overview.component';
import {LoginComponent} from './auth/login/login.component';
import {MainLayoutComponent} from './feature/main-layout/main-layout.component';
import {AuthGuard} from './auth/guards/auht.guard';
import {AuthLayoutComponent} from './feature/auth-layout/auth-layout.component';
import { ProjectCreateComponent } from './feature/project-create/project-create.component';
import { projectDetailsRoutes } from './feature/project-details/project-details.routes';
import { ProjectDetailsComponent } from './feature/project-details/project-details.component';
import {CourseOverviewComponent} from './feature/courses/course-overview/course-overview.component';
import { ProfilepageComponent } from './feature/profilepage/profilepage.component';
export const routes: Routes = [
  {
    // Authenticated routes
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'projects', component: ProjectOverviewComponent },
      {path: 'projects/create', component: ProjectCreateComponent},
      {path: 'projects/:id', children: projectDetailsRoutes},
      {path: 'courses', component: CourseOverviewComponent},
      {path: '', redirectTo: 'projects', pathMatch: 'full'},
      {path: 'profile/${id}', component: ProfilepageComponent}
    ]
  },
  {
    // Unauthenticated routes
    path: 'login',
    component: AuthLayoutComponent,
    children: [
      { path: '', component: LoginComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
