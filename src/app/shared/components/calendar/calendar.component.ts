import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import {
    CalendarEvent,
    CalendarModule,
    CalendarView,
    CalendarUtils,
    DateAdapter,
    CalendarDateFormatter,
    CalendarA11y,
    CalendarEventTitleFormatter
} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {DeadlineService} from '../../../core/services/deadline.service';
import {addMonths, startOfToday, subMonths} from 'date-fns';
import {Deadline} from '../../models/deadline.model';
import {ActiveAssignmentService} from '../../../core/services/active-assignment.service';
import {ButtonComponent} from '../button/button.component';

registerLocaleData(localeNl);


@Component({
    selector: 'app-calendar',
    imports: [CommonModule, CalendarModule, ButtonComponent],
    providers: [{provide: DateAdapter, useFactory: adapterFactory, deps: []}, CalendarUtils, CalendarDateFormatter,
        CalendarA11y, CalendarEventTitleFormatter],
    templateUrl: './calendar.component.html',
    styleUrls: ['node_modules/angular-calendar/dist/css/angular-calendar.css', './calendar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {
    @Input() deadlines: Deadline[] = [];
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
}

