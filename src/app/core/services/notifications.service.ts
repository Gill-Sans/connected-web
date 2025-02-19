import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification } from '../../shared/models/notification.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private http = inject(HttpClient);
    public notifications$: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]); 
    

    getNotificationsByUserId(userId: number): Observable<Notification[]> {
        return this.http.get<Notification[]>(
            `${environment.apiBaseUrl}/api/notifications/user/${userId}`, 
            {withCredentials: true}
        );
    }

    // Update the notification as read and redirect to the destinationUrl
    updateNotificationAsRead(notificationId: number): Observable<Notification> {
        return this.http.put<Notification>(`${environment.apiBaseUrl}/api/notifications/${notificationId}`, {withCredentials: true});
    }

    deleteNotification(notificationId: number): Observable<void>{
        return this.http.delete<void>(`${environment.apiBaseUrl}/api/notifications/${notificationId}`, {withCredentials: true});
    }

   
}