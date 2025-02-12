import {Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthFacade} from '../../auth/store/auth.facade';
import {map} from 'rxjs/operators';

@Directive({
    selector: '[hasRole]'
})
export class HasRoleDirective implements OnInit {
    private userRole: string | null = null;
    private currentRoles: string | string[] | null = null;

    // Bind the input to store the roles and trigger a check when set.
    @Input() set hasRole(roles: string | string[]) {
        this.currentRoles = roles;
        this.checkRole(roles);
    }

    private templateRef = inject<TemplateRef<any>>(TemplateRef);
    private viewContainer = inject(ViewContainerRef);
    private authFacade = inject(AuthFacade);

    ngOnInit(): void {
        // Subscribe to the user's role from the AuthFacade.
        this.authFacade.user$.pipe(
            map(user => user ? user.role : null)
        ).subscribe(role => {
            this.userRole = role;
            // Re-check the role whenever the user's role changes.
            if (this.currentRoles) {
                this.checkRole(this.currentRoles);
            }
        });
    }

    private checkRole(roles: string | string[]): void {
        const allowedRoles = Array.isArray(roles) ? roles : [roles];
        // If the userRole exists and is one of the allowedRoles, render the view.
        if (this.userRole && allowedRoles.includes(this.userRole)) {
            // Only create the view if it hasn't been rendered yet.
            if (!this.viewContainer.length) {
                this.viewContainer.createEmbeddedView(this.templateRef);
            }
        } else {
            // Otherwise, clear the view.
            this.viewContainer.clear();
        }
    }
}
