import { Routes } from '@angular/router';
import { ProjectOverviewComponent } from './feature/project-overview/project-overview.component';
import { ProjectCreateComponent } from './feature/project-create/project-create.component';
import { projectDetailsRoutes } from './feature/project-details/project-details.routes';
import { ProjectDetailsComponent } from './feature/project-details/project-details.component';
export const routes: Routes = [
    {
        path: 'projects',
        component: ProjectOverviewComponent
    },
    {
        path: 'projects/create',
        component: ProjectCreateComponent
    },
    {
        path: 'projects/:id',
        children: projectDetailsRoutes
    }


];
