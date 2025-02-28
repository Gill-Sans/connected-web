import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import { Application } from '../../shared/models/application.model';
import { environment } from '../../../environments/environment';
import {Announcement} from '../../shared/models/announcement.model';

@Injectable({providedIn: 'root'})
export class AnnouncementService {
    private http = inject(HttpClient);

    /**
     * Get all announcements for a given assignment.
     * GET to /api/assignments/{assignmentId}/announcements
     */
    getAnnouncements(assignmentId: number | string): Observable<Announcement[]> {
        return this.http.get<Announcement[]>(`${environment.apiBaseUrl}/api/assignments/${assignmentId}/announcements`, {withCredentials: true});
    }

    /**
     * Create an announcement for a given assignment.
     * POST to /api/assignments/{assignmentId}/announcements
     */
    createAnnouncement(assignmentId: number | string, announcement: Announcement): Observable<Announcement> {
        return this.http.post<Announcement>(`${environment.apiBaseUrl}/api/assignments/${assignmentId}/announcements`, announcement, {withCredentials: true});
    }
}
