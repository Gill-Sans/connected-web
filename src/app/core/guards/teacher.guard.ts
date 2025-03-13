import {inject, Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {map, Observable} from 'rxjs';
import {AuthFacade} from '../../auth/store/auth.facade';
import {Role} from '../../auth/models/role.model';

@Injectable({providedIn: 'root'})
export class TeacherGuard implements CanActivate {
    private readonly authFacade: AuthFacade = inject(AuthFacade);
    private readonly router: Router = inject(Router)

    canActivate(): Observable<boolean> {
        return this.authFacade.user$.pipe(
            map(user => {
                if (user && user.role === Role.Teacher) {
                    return true;
                } else {
                    this.router.navigate(['/']);
                    return false;
                }
            })
        );
    }
}
