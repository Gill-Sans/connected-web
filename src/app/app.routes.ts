import { Routes } from '@angular/router';
import { ProjectOverviewComponent } from './feature/project-overview/project-overview.component';
export const routes: Routes = [
    {
        path: 'projects',
        component: ProjectOverviewComponent
    },
    { path: '**', component: ProjectOverviewComponent } // Redirect to projects if route not found
];
