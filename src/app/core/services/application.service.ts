import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import { Application } from '../../shared/models/application.model';
import { environment } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class ApplicationService {
private http = inject(HttpClient);
    
    getApplication(id: number): Observable<Application> {
        console.log('Getting application with id:', id);
        return this.http.get<Application>(`${environment.apiBaseUrl}/api/applications/${id}`, {withCredentials: true});
    }


}