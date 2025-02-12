import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Assignment } from '../../shared/models/assignment.model';
import { Course } from '../../shared/models/course.model';

export interface ActiveAssignment {
    assignment: Assignment;
    course: Course;
}

@Injectable({
    providedIn: 'root'
})
export class ActiveAssignmentService {
    private activeAssignmentSubject = new BehaviorSubject<ActiveAssignment | null>(null);
    public activeAssignment$: Observable<ActiveAssignment | null> = this.activeAssignmentSubject.asObservable();

    setActiveAssignment(active: ActiveAssignment): void {
        this.activeAssignmentSubject.next(active);
    }

    getActiveAssignment(): ActiveAssignment | null {
        return this.activeAssignmentSubject.getValue();
    }
}

