import {Injectable, OnInit, inject} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Assignment} from '../../shared/models/assignment.model';
import {Course} from '../../shared/models/course.model';
import { CookieService } from './cookieService';
import { ActiveAssignment } from '../../shared/models/activeAssignment.model';


@Injectable({
    providedIn: 'root'
})
export class ActiveAssignmentService {

    private activeAssignmentSubject = new BehaviorSubject<ActiveAssignment | null>(null);
    private cookieService = inject(CookieService);
    
    private readonly ASSIGNMENT_COOKIE_KEY = 'activeAssignment';
    private reloadTrigger = new BehaviorSubject<boolean>(false);

    //TODO: check if new assignment is selected and if it is, reload the page
    public activeAssignment$: Observable<ActiveAssignment | null> = this.activeAssignmentSubject.asObservable();
    public reload$: Observable<boolean> = this.reloadTrigger.asObservable();

    //check if the cookie exists and if it does, set the active assignment
    setActiveAssignment(active: ActiveAssignment): void {
        const currentAssignment = this.activeAssignmentSubject.getValue()
        this.activeAssignmentSubject.next(active);
        this.saveActiveAssignment(active);
        this.reloadTrigger.next(true);
        
    }

    getActiveAssignment(): ActiveAssignment| null {
        return this.activeAssignmentSubject.getValue();
    }

    saveActiveAssignment(activeAssignment: ActiveAssignment): void{
        this.cookieService.set(this.ASSIGNMENT_COOKIE_KEY, activeAssignment);
    }

    getAssignmentId(): number | null {
        return this.cookieService.get<number>(this.ASSIGNMENT_COOKIE_KEY);
    }

    
    clearAssignmentId(): void {
        this.cookieService.delete(this.ASSIGNMENT_COOKIE_KEY);
    }

    resetReloadTrigger(): void {
        this.reloadTrigger.next(false);
    }
}

