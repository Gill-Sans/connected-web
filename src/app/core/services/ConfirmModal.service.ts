import { Injectable, ApplicationRef, Injector, ComponentRef, createComponent } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {ConfirmationModalComponent} from '../../shared/components/confirmation-modal/confirmation-modal.component';

export interface ConfirmationOptions {
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
}

@Injectable({
    providedIn: 'root'
})
export class ConfirmModalService {
    private modalComponentRef: ComponentRef<ConfirmationModalComponent> | null = null;

    constructor(
        private appRef: ApplicationRef,
        private injector: Injector
    ) {}

    open(options: ConfirmationOptions): Observable<boolean> {
        const subject = new Subject<boolean>();

        // Create the modal component using the new createComponent API.
        this.modalComponentRef = createComponent(ConfirmationModalComponent, {
            environmentInjector: this.appRef.injector
        });

        // Set modal inputs.
        this.modalComponentRef.instance.title = options.title;
        this.modalComponentRef.instance.message = options.message;
        this.modalComponentRef.instance.confirmText = options.confirmText;
        this.modalComponentRef.instance.cancelText = options.cancelText;

        // Subscribe to modal events.
        this.modalComponentRef.instance.confirm.subscribe(() => {
            subject.next(true);
            subject.complete();
            this.removeModal();
        });
        this.modalComponentRef.instance.cancel.subscribe(() => {
            subject.next(false);
            subject.complete();
            this.removeModal();
        });

        // Attach the component's view to the application and add its DOM element to the body.
        this.appRef.attachView(this.modalComponentRef.hostView);
        const domElem = (this.modalComponentRef.hostView as any).rootNodes[0] as HTMLElement;
        document.body.appendChild(domElem);

        return subject.asObservable();
    }

    private removeModal(): void {
        if (this.modalComponentRef) {
            this.appRef.detachView(this.modalComponentRef.hostView);
            this.modalComponentRef.destroy();
            this.modalComponentRef = null;
        }
    }
}
