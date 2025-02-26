import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Assignment} from '../../shared/models/assignment.model';
import { Application } from '../../shared/models/application.model';

@Injectable({providedIn: 'root'})
export class AssignmentService {
    private http = inject(HttpClient);

    getCanvasAssignments(courseId: number): Observable<Assignment[]> {
        return this.http.post<Assignment[]>(`${environment.apiBaseUrl}/api/assignments/canvas/${courseId}`, {}, {withCredentials: true});
    }

    createAssignment(assignment: Assignment): Observable<Assignment> {
        return this.http.post<Assignment>(`${environment.apiBaseUrl}/api/assignments/`, assignment, {withCredentials: true});
    }

    getAllApplicationsFromAssignment(id: number): Observable<Application[]> {
        return this.http.get<Application[]>(`${environment.apiBaseUrl}/api/assignments/${id}/applications`, { withCredentials: true });
    }
}
