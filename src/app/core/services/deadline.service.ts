import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import { environment } from '../../../environments/environment';
import {Deadline} from '../../shared/models/deadline.model';

@Injectable({providedIn: 'root'})
export class DeadlineService {
    private http = inject(HttpClient);

    getAllDeadlinesForAssignment(assignmentId: number): Observable<Deadline[]> {
        return this.http.get<Deadline[]>(`${environment.apiBaseUrl}/api/deadlines/assignment/${assignmentId}`, {withCredentials: true});
    }

    getDeadlineById(deadlineId: number): Observable<Deadline> {
        return this.http.get<Deadline>(`${environment.apiBaseUrl}/api/deadlines/${deadlineId}`, {withCredentials: true});
    }

    createDeadline(assignmentId: number, deadline: Deadline): Observable<Deadline> {
        return this.http.post<Deadline>(`${environment.apiBaseUrl}/api/deadlines/${assignmentId}`, deadline, {withCredentials: true});
    }

    updateDeadline(deadline: Deadline): Observable<Deadline> {
        return this.http.put<Deadline>(`${environment.apiBaseUrl}/api/deadlines/${deadline.id}`, deadline, {withCredentials: true});
    }

    deleteDeadline(deadlineId: number): Observable<void> {
        return this.http.delete<void>(`${environment.apiBaseUrl}/api/deadlines/${deadlineId}`, {withCredentials: true});
    }

}
