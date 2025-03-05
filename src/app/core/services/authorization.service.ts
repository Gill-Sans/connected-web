import { Injectable, inject } from '@angular/core';
import { AuthFacade } from '../../auth/store/auth.facade';
import { Observable, combineLatest, map } from 'rxjs';
import { Project } from '../../shared/models/project.model';
import { Role } from '../../auth/models/role.model';
import {Application} from '../../shared/models/application.model';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {
    private readonly authFacade: AuthFacade = inject(AuthFacade);

    /**
     * Returns an observable that emits true if the current user is a teacher.
     */
    isTeacher$(): Observable<boolean> {
        return this.authFacade.user$.pipe(
            map(user => user?.role === Role.Teacher)
        );
    }

    isResearcher$(): Observable<boolean> {
        return this.authFacade.user$.pipe(
            map(user => user?.role === Role.Researcher)
        );
    }

    /**
     * Returns an observable that emits true if the current user is the owner of the given project.
     */
    isOwner$(project: Project): Observable<boolean> {
        return this.authFacade.user$.pipe(
            map(user => !!user && project.productOwner && project.productOwner.id === user.id)
        );
    }

    hasApplied$(project: Project): Observable<boolean> {
        return this.authFacade.user$.pipe(
            map(user =>
                !!user &&
                !!user.applications &&
                user.applications.some(application => application.project.id === project.id)
            )
        );
    }

    isApplicationOwner$(application: Application): Observable<boolean> {
        return this.authFacade.user$.pipe(
            map(user => !!user && application.applicant && application.applicant.id === user.id)
        );
    }

    /**
     * Returns an observable that emits true if the current user is a member of the project.
     * Assumes `project.members` is an array of users with an 'id' property.
     */
    isMember$(project: Project): Observable<boolean> {
        return this.authFacade.user$.pipe(
            map(user => !!user && !!project.members && project.members.some(member => member.id === user.id))
        );
    }

    /**
     * Returns an observable that emits true if the current user can manage the project.
     * This is true if the user is a teacher or the owner
     */
    canManageProject$(project: Project): Observable<boolean> {
        return combineLatest([this.isTeacher$(), this.isOwner$(project)]).pipe(
            map(([isTeacher, isOwner]) => isTeacher || isOwner)
        );
    }
}
