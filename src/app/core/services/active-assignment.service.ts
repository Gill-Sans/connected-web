import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActiveAssignment } from '../../shared/models/activeAssignment.model';


@Injectable({
    providedIn: 'root'
})
export class ActiveAssignmentService {

    private activeAssignmentSubject = new BehaviorSubject<ActiveAssignment | null>(null);

    //TODO: check if new assignment is selected and if it is, reload the page
    public activeAssignment$: Observable<ActiveAssignment | null> = this.activeAssignmentSubject.asObservable();

    //check if the cookie exists and if it does, set the active assignment
    setActiveAssignment(active: ActiveAssignment): void {
        this.activeAssignmentSubject.next(active);
    }

    getActiveAssignment(): ActiveAssignment | null {
        return this.activeAssignmentSubject.getValue();
    }
}

