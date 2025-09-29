import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {BugCreate} from '../../shared/models/bug.model';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class BugService {
    private http = inject(HttpClient);
    private base = `${environment.apiBaseUrl}/api/bugs`;

    create(payload: BugCreate): Observable<void> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post<void>(this.base, payload, { withCredentials: true, headers });
    }
}
