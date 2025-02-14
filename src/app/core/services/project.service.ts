import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project } from '../../shared/models/project.model';
import { response } from 'express';
import { Application } from '../../shared/models/application.model';
import { ApplicationCreate } from '../../shared/models/application.model';
import { createFeedback, Feedback } from '../../shared/models/feedback.model';

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

    getProjectApplications(projectId: string): Observable<Application[]> {
        return this.http.get<Application[]>(`${environment.apiBaseUrl}/api/projects/${projectId}/applications`, {
            withCredentials: true
        });
    }

    approveApplication(projectId: string, applicationId: number): Observable<void> {
        return this.http.post<void>(`${environment.apiBaseUrl}/api/projects/${projectId}/applications/${applicationId}/approve`, {}, {
            withCredentials: true
        });
    }

    rejectApplication(projectId: string, applicationId: number): Observable<void> {
        return this.http.post<void>(`${environment.apiBaseUrl}/api/projects/${projectId}/applications/${applicationId}/reject`, {}, {
            withCredentials: true
        });
    }


    getFeedback(projectId: string): Observable<Feedback[]> {
        return this.http.get<Feedback[]>(`${environment.apiBaseUrl}/api/projects/${projectId}/feedback`, {
            withCredentials: true
        });
    }

    submitFeedback(projectId: string, feedback: createFeedback): Observable<void> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this.http.post<void>(`${environment.apiBaseUrl}/api/projects/${projectId}/feedback`, feedback, {
            withCredentials: true,
            headers: headers
        });
    }


    applyForProject(projectId: string, application: ApplicationCreate): Observable<Project> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this.http.post<Project>(`${environment.apiBaseUrl}/api/projects/${projectId}/apply`, application, {
            withCredentials: true,
            headers: headers
        });
    }
}
