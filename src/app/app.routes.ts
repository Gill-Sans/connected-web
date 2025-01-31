import { Routes } from '@angular/router';
import { ProjectOverviewComponent } from './feature/project-overview/project-overview.component';
import { ProjectCreateComponent } from './feature/project-create/project-create.component';
export const routes: Routes = [
    {
        path: 'projects',
        component: ProjectOverviewComponent
    },
    {
        path: 'projects/create',
        component: ProjectCreateComponent
    }


];
