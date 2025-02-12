import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project } from '../../shared/models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
    private http = inject(HttpClient);

    getAllProjects(assignmentId: number): Observable<Project[]> {
        const headers = new HttpHeaders().set('assignmentId', assignmentId.toString());

        let response = this.http.get<Project[]>(`${environment.apiBaseUrl}/api/projects/`, {
            withCredentials: true,
            headers: headers
        });

        response.subscribe(projects => {
            console.log('projects:', projects);
        });

        return response;
    }
}
