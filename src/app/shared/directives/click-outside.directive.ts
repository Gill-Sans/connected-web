import {Directive, ElementRef, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
    selector: '[clickOutside]',
    exportAs: 'clickOutside'
})
export class ClickOutsideDirective {
    @Output() clickOutside: EventEmitter<Event> = new EventEmitter<Event>();

    constructor(private elementRef: ElementRef) {}

    @HostListener('document:click', ['$event'])
    public onDocumentClick(event: Event): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.clickOutside.emit(event);
        }
    }
}
