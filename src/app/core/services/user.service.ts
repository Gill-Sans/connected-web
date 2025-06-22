import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../../auth/models/user.model';
import {catchError} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly baseUrl = 'http://localhost:8080/api/users';

    constructor(private http: HttpClient) {
    }

    getUserProfile(id: number): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}/${id}`, {withCredentials: true});
    }

    //TODO change any type to userupdate type
    updateUserProfile(updatedUser: Partial<User>): Observable<User> {

        return this.http.patch<User>(
            `${this.baseUrl}/update`,
            updatedUser,
            {
                withCredentials: true
            }
        ).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('UserService - Error details:', {
                    status: error.status,
                    message: error.message,
                    error: error.error
                });
                throw error;
            })
        );
    }

    sendVerificationEmail(email: string): Observable<void>{
        return this.http.post<void>(
            `${this.baseUrl}/send-verification-email`,
            { email },
            { withCredentials: true }
        )
    }

    checkEmailVerified(email: string): Observable<boolean> {
        return this.http.post<boolean>(
            `${this.baseUrl}/check-email-verified`,
            { email },
            { withCredentials: true }
        );
    }

    getCurrentUser(): Observable<User> {
        return this.http.get<User>(
            `${this.baseUrl}/user`,
            { withCredentials: true }
        );
    }


}
