import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {
    catchError,
    distinctUntilChanged,
    map,
    Observable,
    of,
    shareReplay,
    startWith,
    switchMap
} from 'rxjs';

import {AnnouncementService} from '../../core/services/announcement.service';
import {DeadlineService} from '../../core/services/deadline.service';
import {ProjectService} from '../../core/services/project.service';
import {ActiveAssignmentService} from '../../core/services/active-assignment.service';
import {ActiveAssignmentRoutingService} from '../../core/services/active-assignment-routing.service';
import {AssignmentService} from '../../core/services/assignment.service';

import {Announcement} from '../../shared/models/announcement.model';
import {Deadline} from '../../shared/models/deadline.model';
import {Project} from '../../shared/models/project.model';
import * as echarts from 'echarts/core';
import {PieChart} from 'echarts/charts';
import {LegendComponent, TooltipComponent} from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';
import type {EChartsOption} from 'echarts';

import {AnnouncementCardComponent} from '../../shared/components/announcement-card/announcement-card.component';
import {ButtonComponent} from '../../shared/components/button/button.component';
import {ProjectcardComponent} from '../../shared/components/projectcard/projectcard.component';
import {CalendarSmallComponent} from '../../shared/components/calendar-small/calendar-small.component';
import {HasRoleDirective} from '../../shared/directives/HasRole.directive';
import {Role} from '../../auth/models/role.model';
import {DashboardDetailsDto, UserSummaryDto} from '../../shared/models/dashboard.model';
import {StatuscardComponent} from '../../shared/components/statuscard/statuscard.component';
import {provideEchartsCore, NgxEchartsDirective} from 'ngx-echarts';

echarts.use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer]);

@Component({
    selector: 'app-dashboard',
    imports: [
        CommonModule,
        AnnouncementCardComponent,
        CalendarSmallComponent,
        ButtonComponent,
        ProjectcardComponent,
        HasRoleDirective,
        StatuscardComponent,
        NgxEchartsDirective
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    providers: [
        provideEchartsCore({ echarts })
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {

    private readonly announcementService = inject(AnnouncementService);
    private readonly deadlineService = inject(DeadlineService);
    private readonly projectService = inject(ProjectService);
    private readonly activeAssignmentService = inject(ActiveAssignmentService);
    private readonly activeAssignmentRoutingService = inject(ActiveAssignmentRoutingService);
    private readonly assignmentService = inject(AssignmentService);
    private readonly router = inject(Router);
    protected readonly Role = Role;

    private readonly activeAssignment$ = this.activeAssignmentService.activeAssignment$;

    private readonly assignmentId$: Observable<number | null> = this.activeAssignment$.pipe(
        map(activeAssignment => activeAssignment?.assignment.id ?? null),
        distinctUntilChanged(),
        shareReplay({ bufferSize: 1, refCount: true })
    );

    // ---------- Teacher dashboard streams ----------
    protected readonly dashboard$: Observable<DashboardDetailsDto | null> = this.assignmentId$.pipe(
        switchMap(id => {
            if (id == null) {
                return of<DashboardDetailsDto | null>(null);
            }
            return this.assignmentService.getAssignmentDashboard(id).pipe(
                catchError(err => {
                    console.error('Failed to load dashboard data', err);
                    return of<DashboardDetailsDto | null>(null);
                })
            );
        }),
        startWith<DashboardDetailsDto | null>(null),
        shareReplay({ bufferSize: 1, refCount: true })
    );

    protected readonly studentDistributionChartOptions$: Observable<EChartsOption> = this.dashboard$.pipe(
        map(dashboard => {
            if (!dashboard) {
                return {
                    color: ['#4caf50', '#ff9800'],
                    tooltip: { trigger: 'item' },
                    legend: { show: false },
                    series: []
                } satisfies EChartsOption;
            }

            const assigned = dashboard.counts.assignedStudents ?? 0;
            const unassigned = dashboard.counts.unassignedStudents ?? 0;
            const hasData = assigned + unassigned > 0;

            return {
                color: ['#4caf50', '#ff9800'],
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c} ({d}%)'
                },
                legend: { show: false },
                series: [
                    {
                        type: 'pie',
                        radius: ['55%', '85%'],
                        avoidLabelOverlap: true,
                        itemStyle: {
                            borderColor: '#fff',
                            borderWidth: 2,
                            borderRadius: 6
                        },
                        label: {
                            show: !hasData,
                            position: 'center',
                            formatter: hasData ? '' : 'No data',
                            fontSize: 14,
                            color: '#888'
                        },
                        emphasis: {
                            scale: true,
                            scaleSize: 6
                        },
                        data: [
                            { value: assigned, name: 'Assigned' },
                            { value: unassigned, name: 'Unassigned' }
                        ]
                    }
                ]
            } satisfies EChartsOption;
        }),
        shareReplay({ bufferSize: 1, refCount: true })
    );

    protected readonly studentsToNudge$: Observable<Array<UserSummaryDto & { reason: string }>> = this.dashboard$.pipe(
        map(dashboard => {
            if (!dashboard) {
                return [] as Array<UserSummaryDto & { reason: string }>;
            }

            const unassigned = (dashboard.lists.unassignedStudents ?? []).map(s => ({ ...s, reason: 'Unassigned' as const }));
            const needs = (dashboard.lists.needsRevision ?? [])
                .filter(p => !!p.createdBy)
                .map(p => ({ ...(p.createdBy as UserSummaryDto), reason: 'Needs revision' as const }));
            const seen = new Set<number>();
            return [...unassigned, ...needs].filter(s => (seen.has(s.id) ? false : (seen.add(s.id), true)));
        }),
        shareReplay({ bufferSize: 1, refCount: true })
    );
    // -----------------------------------------------

    // ---------- Student dashboard streams ----------
    protected readonly announcements$: Observable<Announcement[]> = this.assignmentId$.pipe(
        switchMap(id => {
            if (id == null) {
                return of<Announcement[]>([]);
            }
            return this.announcementService.getAnnouncements(id).pipe(
                catchError(err => {
                    console.error('Failed to load announcements', err);
                    return of<Announcement[]>([]);
                })
            );
        }),
        startWith<Announcement[]>([]),
        shareReplay({ bufferSize: 1, refCount: true })
    );

    protected readonly project$: Observable<Project | null> = this.assignmentId$.pipe(
        switchMap(id => {
            if (id == null) {
                return of<Project | null>(null);
            }
            return this.projectService.getProjectByUserAndAssignmentId(String(id)).pipe(
                catchError(err => {
                    console.error('Failed to load project', err);
                    return of<Project | null>(null);
                })
            );
        }),
        startWith<Project | null>(null),
        shareReplay({ bufferSize: 1, refCount: true })
    );

    protected readonly deadlines$: Observable<Deadline[]> = this.assignmentId$.pipe(
        switchMap(id => {
            if (id == null) {
                return of<Deadline[]>([]);
            }
            return this.deadlineService.getAllDeadlinesForAssignment(id).pipe(
                catchError(err => {
                    console.error('Failed to load deadlines', err);
                    return of<Deadline[]>([]);
                })
            );
        }),
        startWith<Deadline[]>([]),
        shareReplay({ bufferSize: 1, refCount: true })
    );

    // Student actions
    navigateToProjects(): void {
        this.router.navigate(this.activeAssignmentRoutingService.buildRoute('projects'));
    }
    navigateToProject(id: number): void {
        this.router.navigate(this.activeAssignmentRoutingService.buildRoute('projects', id.toString()));
    }

    // Teacher actions
    openProject(id: number): void {
        this.router.navigate(this.activeAssignmentRoutingService.buildRoute('projects', id.toString()));
    }
    messageStudent(id: number): void {
        // Hook into your messaging UI
        console.log('Message student', id);
    }
}
