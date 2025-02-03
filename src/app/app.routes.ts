import { Routes } from '@angular/router';
import { ProjectOverviewComponent } from './feature/project-overview/project-overview.component';
import {LoginComponent} from './auth/login/login.component';
import {MainLayoutComponent} from './feature/main-layout/main-layout.component';
import {AuthGuard} from './auth/guards/auht.guard';
import {AuthLayoutComponent} from './feature/auth-layout/auth-layout.component';
export const routes: Routes = [
  {
    // Authenticated routes
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'projects', component: ProjectOverviewComponent },
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
