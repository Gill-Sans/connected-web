import {Component, Input, OnInit, OnChanges, SimpleChanges, ViewEncapsulation, Injectable} from '@angular/core';
import {ButtonComponent} from '../button/button.component';
import {
    CalendarA11y,
    CalendarDateFormatter, CalendarEvent, CalendarEventTitleFormatter,
    CalendarModule, CalendarNativeDateFormatter,
    CalendarUtils,
    DateAdapter, DateFormatterParams
} from 'angular-calendar';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {Deadline} from '../../models/deadline.model';
import {addMonths, format, startOfToday, subMonths} from 'date-fns';

@Injectable()
class CustomDateFormatter extends CalendarNativeDateFormatter {
    public override monthViewColumnHeader({date, locale}: DateFormatterParams): string {
        return new Intl.DateTimeFormat(locale, {weekday: 'short'}).format(date);
    }
}

@Component({
    selector: 'app-calendar-small',
    imports: [CommonModule, CalendarModule, ButtonComponent, NgOptimizedImage],
    providers: [
        { provide: DateAdapter, useFactory: adapterFactory, deps: [] },
        { provide: CalendarDateFormatter, useClass: CustomDateFormatter },
        CalendarUtils,
        CalendarA11y,
        CalendarEventTitleFormatter
    ],
    templateUrl: './calendar-small.component.html',
    styleUrls: ['./calendar-small.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CalendarSmallComponent implements OnInit, OnChanges {
    @Input() deadlines: Deadline[] = [];
    viewDate: Date = new Date();
    events: CalendarEvent[] = [];

    ngOnInit(): void {
        this.loadDeadlines();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['deadlines']) {
            this.loadDeadlines();
        }
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
}
