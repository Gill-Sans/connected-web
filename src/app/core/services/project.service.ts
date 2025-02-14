import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project } from '../../shared/models/project.model';
import { response } from 'express';
import { ApplicationCreate } from '../../shared/models/application.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
    private http = inject(HttpClient);

    getAllProjects(assignmentId: number): Observable<Project[]> {
        const headers = new HttpHeaders().set('assignmentId', assignmentId.toString());

        let response = this.http.get<Project[]>(`${environment.apiBaseUrl}/api/projects`, {
            withCredentials: true,
            headers: headers
        });

        response.subscribe(projects => {
            console.log('projects:', projects);
        });

        return response;
    }

    createProject(
        assignmentId: number,
        projectData: Project
    ): Observable<Project> {
        const headers = new HttpHeaders()
            .append('assignmentId', assignmentId.toString())
            .append('Content-Type', 'application/json');

        return this.http.post<Project>(`${environment.apiBaseUrl}/api/projects/create`, projectData, {
            withCredentials: true,
            headers: headers
        });
    }

    getProject(projectId: string): Observable<Project> {
        if (!projectId) {
            throw new Error('Project ID is required');
        }
        return this.http.get<Project>(`${environment.apiBaseUrl}/api/projects/${projectId}`, {
            withCredentials: true
        });
    }

    applyForProject(projectId: number, application: ApplicationCreate): Observable<Project> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this.http.post<Project>(`${environment.apiBaseUrl}/api/projects/${projectId}/apply`, application, {
            withCredentials: true,
            headers: headers
        });
    }
}
