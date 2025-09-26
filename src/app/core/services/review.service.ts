import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {CreateReview, Review} from '../../shared/models/review.model';
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    private readonly baseUrl = environment.apiBaseUrl

    constructor(private http: HttpClient) {
    }

    // Create a new review
    createReview(projectId: string, review: CreateReview): Observable<Review> {
        return this.http.post<Review>(
            `${this.baseUrl}/api/projects/${projectId}/reviews`,
            review,
            {
                withCredentials: true
            }
        ).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('ReviewService - Error details:', {
                    status: error.status,
                    message: error.message,
                    error: error.error
                });
                throw error;
            })
        );
    }

    // Get all reviews by projectId
    getReviewsByProjectId(projectId: string): Observable<Review[]> {
        return this.http.get<Review[]>(`${this.baseUrl}/api/projects/${projectId}/reviews`, {
            withCredentials: true
        }).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('ReviewService - Error details:', {
                    status: error.status,
                    message: error.message,
                    error: error.error
                });
                throw error;
            })
        );
    }

    // Update Review
    updateReview(reviewId: string, review: CreateReview): Observable<Review> {
        return this.http.patch<Review>(
            `${this.baseUrl}/api/reviews/${reviewId}`,
            review,
            {
                withCredentials: true
            }
        ).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('ReviewService - Error details:', {
                    status: error.status,
                    message: error.message,
                    error: error.error
                });
                throw error;
            })
        );
    }

    // Delete Review
    deleteReview(reviewId: string): Observable<void> {
        return this.http.delete<void>(
            `${this.baseUrl}/api/reviews/${reviewId}`,
            {
                withCredentials: true
            }
        ).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('ReviewService - Error details:', {
                    status: error.status,
                    message: error.message,
                    error: error.error
                });
                throw error;
            })
        );
    }

}
