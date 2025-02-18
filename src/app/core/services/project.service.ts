import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project } from '../../shared/models/project.model';
import { response } from 'express';
import { Application } from '../../shared/models/application.model';
import { ApplicationCreate } from '../../shared/models/application.model';
import {ProjectStatusEnum} from '../../shared/models/ProjectStatus.enum';
import { createFeedback, Feedback } from '../../shared/models/feedback.model';
import {ApplicationStatusEnum} from '../../shared/models/ApplicationStatus.enum';

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

    getAllPublishedProjects(assignmentId: number): Observable<Project[]> {
        const headers: HttpHeaders = new HttpHeaders().set('assignmentId', assignmentId.toString());
        return this.http.get<Project[]>(`${environment.apiBaseUrl}/api/projects/published`, {
            withCredentials: true,
            headers: headers
        });
    }

    createProject(
        assignmentId: number,
        projectData: Project
    ): Observable<Project> {
        const headers = new HttpHeaders()
            .append('assignmentId', assignmentId.toString())
            .append('Content-Type', 'application/json');

        return this.http.post<Project>(`${environment.apiBaseUrl}/api/projects`, projectData, {
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

    reviewApplication(applicationId: number, status: ApplicationStatusEnum): Observable<Application> {
        const headers: HttpHeaders = new HttpHeaders()
            .set('status', status);
        return this.http.post<Application>(`${environment.apiBaseUrl}/api/applications/${applicationId}/review`, {}, {
            withCredentials: true,
            headers: headers
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

    updateProjectStatus(projectId: number, status: ProjectStatusEnum): Observable<Project>{
        const headers: HttpHeaders = new HttpHeaders()
            .set('status', status);
        return this.http.post<Project>(`${environment.apiBaseUrl}/api/projects/${projectId}/status`,   {}, {
            withCredentials: true,
            headers: headers
        });
    }

    publishAllProjects(assignmentId: number): Observable<Project[]> {
        const headers: HttpHeaders = new HttpHeaders().set('assignmentId', assignmentId.toString());
        return this.http.post<Project[]>(`${environment.apiBaseUrl}/api/assignments/${assignmentId}/projects/publish`, {}, {
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
