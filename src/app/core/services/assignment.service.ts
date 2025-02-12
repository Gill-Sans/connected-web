import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Assignment} from '../../shared/models/assignment.model';
import { CookieService } from './cookieService';


@Injectable({providedIn: 'root'})
export class AssignmentService {
    private http = inject(HttpClient);
    private cookieService = inject(CookieService);
    private readonly ASSIGNMENT_COOKIE_KEY = 'assignmentId';
    getCanvasAssignments(courseId: number): Observable<any[]> {
        return this.http.post<any[]>(`${environment.apiBaseUrl}/api/assignments/canvas/${courseId}`, {}, {withCredentials: true});
    }

    createAssignment(assignment: Assignment): Observable<any> {
        return this.http.post<any>(`${environment.apiBaseUrl}/api/assignments/`, assignment, {withCredentials: true});
    }

    getAllAssignments(courseId: number): Observable<Assignment[]> {
        let response = this.http.get<Assignment[]>(`${environment.apiBaseUrl}/api/courses/${courseId}/assignments`, {withCredentials: true});
        response.subscribe(assignment => {
            console.log('Assignments:', assignment);
        });
        return response;
    }

    saveAssignmentId(assignmentId: number): void{
        this.cookieService.set(this.ASSIGNMENT_COOKIE_KEY, assignmentId);
    }

    getAssignmentId(): number | null {
        return this.cookieService.get<number>(this.ASSIGNMENT_COOKIE_KEY);
    }

    
    clearAssignmentId(): void {
        this.cookieService.delete(this.ASSIGNMENT_COOKIE_KEY);
    }





}