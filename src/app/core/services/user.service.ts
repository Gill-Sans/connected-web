import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../../auth/models/user.model';
import {catchError} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly baseUrl = 'http://localhost:8080/users';

    constructor(private http: HttpClient) {
    }

    getUserProfile(id: number): Observable<User> {
        console.log("API call: Fetch user with ID:", id);
        return this.http.get<User>(`${this.baseUrl}/${id}`, {withCredentials: true});
    }

    //TODO change any type to userupdate type
    updateUserProfile(updatedUser: Partial<User>): Observable<User> {
        console.log('UserService - Sending update request:', updatedUser);

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

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.baseUrl);
    }

}
