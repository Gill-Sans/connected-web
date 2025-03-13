import {inject, Injectable, NgZone} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {AuthFacade} from './store/auth.facade';
import {RegistrationRequest} from './models/registration-request.model';

@Injectable({providedIn: 'root'})
export class AuthService {
    private authFacade: AuthFacade = inject(AuthFacade);
    private http: HttpClient = inject(HttpClient);
    private ngZone: NgZone = inject(NgZone);

    getCurrentUser(): Observable<any> {
        return this.http.get(`${environment.apiBaseUrl}/auth/user`, {withCredentials: true});
    }

    login(username: string, password: string): Observable<any> {
        const body = new URLSearchParams();
        body.set('username', username);
        body.set('password', password);

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        // This will trigger the form login flow on the backend and set the JSESSIONID cookie.
        return this.http.post(`${environment.apiBaseUrl}/auth/login`, body.toString(), { headers, withCredentials: true });
    }

    register(request: RegistrationRequest): Observable<any> {
        return this.http.post(`${environment.apiBaseUrl}/auth/register`, request, { withCredentials: true });
    }

    logout(): void {
        this.ngZone.run(() => {
            this.http.post(`${environment.apiBaseUrl}/logout`, {}, { withCredentials: true }).subscribe({
                next: () => {
                    this.deleteCookie('JSESSIONID');
                    this.authFacade.redirectToLogin();
                }
            });
        });
    }

    private deleteCookie(name: string): void {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
}
