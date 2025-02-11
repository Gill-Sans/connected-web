import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../auth/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private readonly baseUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) { }


  getUserProfile(id: number): Observable<User> {
    console.log("API call: Fetch user with ID:", id);
    return this.http.get<User>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  updateUserProfile(id: number,updatedUser: any): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, updatedUser);
  }


  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }
}
