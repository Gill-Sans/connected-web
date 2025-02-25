import {Directive, inject, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthFacade} from '../../auth/store/auth.facade';
import {map} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Directive({
    selector: '[hasRole]'
})
export class HasRoleDirective implements OnInit, OnDestroy {
    private userRole: string | null = null;
    private currentRoles: string | string[] | null = null;
    private subscription: Subscription = new Subscription();

    @Input() set hasRole(roles: string | string[]) {
        this.currentRoles = roles;
        this.checkRole(roles);
    }

    private templateRef = inject<TemplateRef<any>>(TemplateRef);
    private viewContainer = inject(ViewContainerRef);
    private authFacade = inject(AuthFacade);

    ngOnInit(): void {
        this.subscription.add(
            this.authFacade.user$.pipe(
                map(user => user ? user.role : null)
            ).subscribe(role => {
                this.userRole = role;
                if (this.currentRoles) {
                    this.checkRole(this.currentRoles);
                }
            })
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private checkRole(roles: string | string[]): void {
        const allowedRoles = Array.isArray(roles) ? roles : [roles];
        if (this.userRole && allowedRoles.includes(this.userRole)) {
            if (!this.viewContainer.length) {
                this.viewContainer.createEmbeddedView(this.templateRef);
            }
        } else {
            this.viewContainer.clear();
        }
    }
}
