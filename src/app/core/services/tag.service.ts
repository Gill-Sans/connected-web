import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { tag, tagCreate } from '../../shared/models/tag.model';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TagService {
    private readonly baseUrl = environment.apiBaseUrl

    constructor(private http: HttpClient) {
    }

    searchTags(query: string): Observable<tag[]> {
        return this.http.get<tag[]>(`${this.baseUrl}/tag/search?query=${query}`, { withCredentials: true })
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    console.error("Error fetching tags:", error);
                    console.error("Server response:", error.error);
                    return throwError(() => new Error("Failed to fetch tags"));
                })
            );
    }

    createTag(tag: tagCreate): Observable<tag> {
        return this.http.post<tag>(this.baseUrl, tag, { withCredentials: true })
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    console.error("Error creating tag:", error);
                    console.error("Server response:", error.error);
                    return throwError(() => new Error("Failed to create tag"));
                })
            );
    }

}
