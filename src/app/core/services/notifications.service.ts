import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification } from '../../shared/models/notification.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Stomp } from '@stomp/stompjs';
import { AuthFacade } from '../../auth/store/auth.facade';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private http = inject(HttpClient);
    public notifications$: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);
    private authFacade = inject(AuthFacade);
    private user$ = this.authFacade.user$;
    private stompClient: any;



    initializeWebSocket(userId: number) {
        const serverUrl = `${environment.apiBaseUrl.replace(/^http/, 'ws')}/ws`;

        //  nieuwe WebSocket-instantie te creëren
        this.stompClient = Stomp.over(() => {
            return new WebSocket(serverUrl);
        });

        // Probeer verbinding te maken met de STOMP-server
        this.connectStomp(userId);
    }

    //reconnect logic
    private connectStomp(userId: number) {
        this.stompClient.connect({}, (frame: any) => {
            this.stompClient.subscribe(`/user/${userId}/notifications`, (message: any) => {
                const currentNotifications = this.notifications$.getValue();
                currentNotifications.push(JSON.parse(message.body));
                this.notifications$.next(currentNotifications);
            }, (error: any) => {
                console.error('Error subscribing to notifications:', error);
            });

            this.user$.pipe(
                switchMap(user => this.getNotificationsByUserId(user?.id))
            ).subscribe(notifications => this.notifications$.next(notifications as Notification[]));
        }, (error: any) => {
            console.error('STOMP connection error:', error);
            setTimeout(() => this.connectStomp(userId), 5000); // Probeer opnieuw te verbinden na 5 seconden
        });
    }

    getNotificationsByUserId(userId: number): Observable<Notification[]> {
        return this.http.get<Notification[]>(
            `${environment.apiBaseUrl}/api/notifications/user/${userId}`,
            {withCredentials: true}
        );
    }

    // Update the notification as read and redirect to the destinationUrl
    markNotificationAsRead(notificationId: number): Observable<Notification> {
        return this.http.put<Notification>(`${environment.apiBaseUrl}/api/notifications/${notificationId}/read`,{}, {withCredentials: true});
    }

    deleteNotification(notificationId: number): Observable<void>{
        return this.http.delete<void>(`${environment.apiBaseUrl}/api/notifications/${notificationId}`, {withCredentials: true});
    }

}

function switchMap(arg0: (user: any) => Observable<Notification[]>): import("rxjs").OperatorFunction<import("../../auth/models/user.model").User | null, unknown> {
    throw new Error('Function not implemented.');
}
