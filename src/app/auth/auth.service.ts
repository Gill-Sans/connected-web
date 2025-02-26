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
        console.log('logging out');
        this.ngZone.run(() => {
            this.http.post(`${environment.apiBaseUrl}/auth/logout`, {}, { withCredentials: true }).subscribe({
                next: () => {
                    console.log('logout successful');
                    console.log('removing JSESSIONID cookie');
                    this.deleteCookie('JSESSIONID');
                    console.log('removed cookie, redirecting to login');
                    this.authFacade.redirectToLogin();
                },
                error: (err) => {
                    console.error('Logout failed', err);
                },
                complete: () => {
                    console.log('HTTP request completed');
                }
            });
        });
    }

    private deleteCookie(name: string): void {
        console.log(`Deleting cookie: ${name}`);
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        console.log(`Cookie ${name} deleted`);
    }
}
