import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import {Observable} from 'rxjs';
import * as http from 'http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userUrl = 'http://localhost:8080/auth/user';

  constructor(private http: HttpClient) { }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/auth/user`, { withCredentials: true });
  }
}
