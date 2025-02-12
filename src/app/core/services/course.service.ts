import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Course} from '../../shared/models/course.model';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class CourseService {
    private http = inject(HttpClient);

    getCanvasCourses(role: string): Observable<any[]> {
        return this.http.post<any[]>(`${environment.apiBaseUrl}/api/courses/canvas?EnrollmentType=${role}`, {}, {withCredentials: true});
    }

    createCourse(course: Course): Observable<any> {
        return this.http.post<any>(`${environment.apiBaseUrl}/api/courses/`, course, {withCredentials: true});
    }

    getAllCourses(): Observable<Course[]> {
        let response = this.http.get<Course[]>(`${environment.apiBaseUrl}/api/courses/`, {withCredentials: true});
        response.subscribe(courses => {
            console.log('Courses:', courses);
        });
        return response;
    }

    getAllEnrolledCourses(): Observable<Course[]> {
        let response = this.http.get<Course[]>(`${environment.apiBaseUrl}/api/courses/enrolled`, {withCredentials: true});
        response.subscribe(courses => {
            console.log('Courses:', courses);
        });
        return response;
    }
}
