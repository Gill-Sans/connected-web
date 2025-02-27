import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import {DeadlineService} from '../../../core/services/deadline.service';
import { addMonths, startOfToday, subMonths } from 'date-fns';
import {Deadline} from '../../models/deadline.model';


@Component({
  selector: 'app-calendar',
  imports: [ CommonModule,
      CalendarModule ],
    providers: [ { provide: DateAdapter, useFactory: adapterFactory }, CalendarUtils,  CalendarDateFormatter,
        CalendarA11y,CalendarEventTitleFormatter ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
    view: CalendarView = CalendarView.Month;
    viewDate: Date = new Date();
    events: CalendarEvent[] = [];

    constructor(private deadlineService: DeadlineService) {}

    ngOnInit(): void {
        this.loadDeadlines();
    }

    loadDeadlines(): void {
        const assignmentId = 1; // Replace with actual assignment ID
        this.deadlineService.getAllDeadlinesForAssignment(assignmentId).subscribe((deadlines: Deadline[]) => {
            this.events = deadlines.map(deadline => ({
                start: new Date(deadline.dueDate),
                title: deadline.title,
                meta: deadline
            }));
        });
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

