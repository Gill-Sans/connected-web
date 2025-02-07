import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8080/api/courses';

  getCanvasCourses(role: string): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiBaseUrl}/canvas?EnrollmentType=${role}`, {}, {
      withCredentials: true //This will now be sent as a request option instead of body
    });
  }
}
