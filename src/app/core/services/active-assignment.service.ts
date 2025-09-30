import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActiveAssignment } from '../../shared/models/activeAssignment.model';
import {take} from 'rxjs/operators';
import {User} from '../../auth/models/user.model';
import {AuthFacade} from '../../auth/store/auth.facade';

const ACTIVE_ASSIGNMENT_KEY = 'activeAssignment';

@Injectable({
    providedIn: 'root'
})
export class ActiveAssignmentService {

    private activeAssignmentSubject: BehaviorSubject<ActiveAssignment | null> = new BehaviorSubject<ActiveAssignment | null>(null);
    public activeAssignment$: Observable<ActiveAssignment | null> = this.activeAssignmentSubject.asObservable();

    private currentUser: User | null = null;

    constructor(private authFacade: AuthFacade) {
        // Get the user ONCE and try to load their assignment
        this.authFacade.user$.pipe(take(1)).subscribe(user => {
            if (user) {
                this.currentUser = user;
                const key = this.getStorageKey(user.id);
                const stored = localStorage.getItem(key);
                if (stored) {
                    try {
                        const assignment = JSON.parse(stored);
                        this.activeAssignmentSubject.next(assignment);
                    } catch (e) {
                        console.error('Failed to parse active assignment from localStorage', e);
                    }
                }
            }
        });
    }

    private getStorageKey(userId: number): string {
        return `activeAssignment_${userId}`;
    }

    setActiveAssignment(active: ActiveAssignment): void {
        this.activeAssignmentSubject.next(active);
        if (this.currentUser) {
            localStorage.setItem(this.getStorageKey(this.currentUser.id), JSON.stringify(active));
        }
    }

    getActiveAssignment(): ActiveAssignment | null {
        return this.activeAssignmentSubject.getValue();
    }

    clearAssignment(): void {
        if (this.currentUser) {
            localStorage.removeItem(this.getStorageKey(this.currentUser.id));
        }
        this.activeAssignmentSubject.next(null);
    }
}

