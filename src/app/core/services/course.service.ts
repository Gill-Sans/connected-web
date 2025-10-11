import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Course} from '../../shared/models/course.model';
import {environment} from '../../../environments/environment';
import {User} from '../../auth/models/user.model';

@Injectable({providedIn: 'root'})
export class CourseService {
    private http = inject(HttpClient);

    private coursesSubject = new BehaviorSubject<Course[]>([]);
    public courses$ = this.coursesSubject.asObservable();

    refreshCourses(): void {
        this.http.get<Course[]>(`${environment.apiBaseUrl}/api/courses/enrolled`, { withCredentials: true })
            .subscribe(courses => {
                this.coursesSubject.next(courses);
            });
    }

    getCanvasCourses(): Observable<any[]> {
        return this.http.post<any[]>(`${environment.apiBaseUrl}/api/courses/canvas`, {}, {withCredentials: true});
    }

    createCourse(course: Course): Observable<any> {
        return this.http.post<any>(`${environment.apiBaseUrl}/api/courses/`, course, {withCredentials: true});
    }

    getAllCourses(): Observable<Course[]> {
        return this.http.get<Course[]>(`${environment.apiBaseUrl}/api/courses/`, {withCredentials: true});
    }

    getAllEnrolledCourses(): Observable<Course[]> {
        return this.http.get<Course[]>(`${environment.apiBaseUrl}/api/courses/enrolled`, {withCredentials: true});
    }

    getAllEnrolledStudentsByCourseId(courseId: string): Observable<User[]> {
        return this.http.get<User[]>(`${environment.apiBaseUrl}/api/courses/${courseId}/students`, {withCredentials: true});
    }

    deleteCourse(courseId: number): Observable<any>{
        return this.http.delete<void>(`${environment.apiBaseUrl}/api/courses/${courseId}`, {withCredentials: true});
    }

    refreshEnrollments(courseId: number): Observable<void> {
        return this.http.post<void>(
            `${environment.apiBaseUrl}/api/courses/${courseId}/enrollments/refresh`,
            {},
            {withCredentials: true}
        );
    }
}
