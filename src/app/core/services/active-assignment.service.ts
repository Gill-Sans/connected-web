import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActiveAssignment } from '../../shared/models/activeAssignment.model';

const ACTIVE_ASSIGNMENT_KEY = 'activeAssignment';

@Injectable({
    providedIn: 'root'
})
export class ActiveAssignmentService {

    private activeAssignmentSubject: BehaviorSubject<ActiveAssignment | null> = new BehaviorSubject<ActiveAssignment | null>(null);
    public activeAssignment$: Observable<ActiveAssignment | null> = this.activeAssignmentSubject.asObservable();

    constructor() {
        // Try to load the active assignment from local storage on initialization.
        const stored = localStorage.getItem(ACTIVE_ASSIGNMENT_KEY);
        if (stored) {
            try {
                const assignment = JSON.parse(stored);
                this.activeAssignmentSubject.next(assignment);
            } catch (e) {
                console.error('Failed to parse active assignment from localStorage', e);
            }
        }
    }

    setActiveAssignment(active: ActiveAssignment): void {
        this.activeAssignmentSubject.next(active);
        localStorage.setItem(ACTIVE_ASSIGNMENT_KEY, JSON.stringify(active));
    }

    getActiveAssignment(): ActiveAssignment | null {
        return this.activeAssignmentSubject.getValue();
    }
}

