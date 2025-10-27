import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import { CommonModule, NgOptimizedImage, registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import {
    CalendarEvent,
    CalendarModule,
    CalendarView,
    CalendarUtils,
    DateAdapter,
    CalendarDateFormatter,
    CalendarA11y,
    CalendarEventTitleFormatter, CalendarMonthViewDay
} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {addMonths, format, startOfDay, startOfToday, subMonths} from 'date-fns';
import {Deadline} from '../../models/deadline.model';
import {ButtonComponent} from '../button/button.component';
import {toZonedTime} from 'date-fns-tz';

registerLocaleData(localeNl);


@Component({
    selector: 'app-calendar',
    imports: [CommonModule, CalendarModule, ButtonComponent, NgOptimizedImage],
    providers: [{provide: DateAdapter, useFactory: adapterFactory, deps: []}, CalendarUtils, CalendarDateFormatter,
        CalendarA11y, CalendarEventTitleFormatter],
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {
    @Input() deadlines: Deadline[] = [];
    @Output() dayClick = new EventEmitter<Date>();
    view: CalendarView = CalendarView.Month;
    viewDate: Date = new Date();
    events: CalendarEvent[] = [];

    ngOnInit(): void {
        this.loadDeadlines();
    }

    ngOnChanges(): void {
        this.loadDeadlines();
    }

    loadDeadlines(): void {
        this.events = this.deadlines.map(deadline => ({
            start: new Date(deadline.dueDate),
            title: deadline.title,
            meta: deadline
        }));
    }

    nextMonth(): void {
        this.viewDate = addMonths(this.viewDate, 1);
    }

    previousMonth(): void {
        this.viewDate = subMonths(this.viewDate, 1);
    }

    goToToday(): void {
        this.viewDate = startOfToday();
    }

    get formattedDate(): string {
        return format(this.viewDate, 'MMMM yyyy');
    }

    convertToTimeZone(date: string): Date {
        const dateObj = new Date(date + 'Z');
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return toZonedTime(dateObj, timeZone);
    }

    onDayClick(day: CalendarMonthViewDay): void {
        this.dayClick.emit(startOfDay(day.date));
    }

}

