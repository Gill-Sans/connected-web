import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {AuthFacade} from './store/auth.facade';

@Injectable({providedIn: 'root'})
export class AuthService {
    private authFacade: AuthFacade = inject(AuthFacade);
    private http: HttpClient = inject(HttpClient);

    getCurrentUser(): Observable<any> {
        return this.http.get(`${environment.apiBaseUrl}/auth/user`, {withCredentials: true});
    }

    logout(): void {
        this.http.post(`${environment.apiBaseUrl}/auth/logout`, {}, { withCredentials: true }).subscribe(() => {
            this.deleteCookie('JSESSIONID');
            console.log('removed cookie, redirecting to login');
            this.authFacade.redirectToLogin();
        });
    }

    private deleteCookie(name: string): void {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
}
