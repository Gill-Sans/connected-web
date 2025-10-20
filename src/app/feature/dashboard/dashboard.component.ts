import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {map, Observable, shareReplay, Subscription, switchMap} from 'rxjs';

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

@Component({
    selector: 'app-dashboard',
    standalone: true,
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
provideEchartsCore({ echarts }),
]
})
export class DashboardComponent implements OnInit, OnDestroy {
    constructor() {
        echarts.use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer]);
    }

    private readonly announcementService = inject(AnnouncementService);
    private readonly deadlineService = inject(DeadlineService);
    private readonly projectService = inject(ProjectService);
    private readonly activeAssignmentService = inject(ActiveAssignmentService);
    private readonly activeAssignmentRoutingService = inject(ActiveAssignmentRoutingService);
    private readonly assignmentService = inject(AssignmentService);
    private readonly router = inject(Router);
    protected readonly Role = Role;

    announcements: Announcement[] = [];
    deadlines$: Observable<Deadline[]> | null = null;
    project: Project | null = null;

    activeAssignment$ = this.activeAssignmentService.activeAssignment$;
    private subscriptions: Subscription[] = [];

    // ---------- Teacher dashboard streams ----------
    assignmentId$: Observable<number> = this.activeAssignment$.pipe(
        map(a => a?.assignment.id as number),
        shareReplay({ bufferSize: 1, refCount: true })
    );

    dashboard$: Observable<DashboardDetailsDto> = this.assignmentId$.pipe(
        switchMap(id => this.assignmentService.getAssignmentDashboard(id)),
        shareReplay({ bufferSize: 1, refCount: true })
    );

    studentDistributionChartOptions$: Observable<EChartsOption> = this.dashboard$.pipe(
        map(d => {
            const assigned = d.counts.assignedStudents ?? 0;
            const unassigned = d.counts.unassignedStudents ?? 0;
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

    studentsToNudge$: Observable<Array<UserSummaryDto & { reason: string }>> = this.dashboard$.pipe(
        map(d => {
            const unassigned = (d.lists.unassignedStudents ?? []).map(s => ({ ...s, reason: 'Unassigned' as const }));
            const needs = (d.lists.needsRevision ?? [])
                .filter(p => !!p.createdBy)
                .map(p => ({ ...(p.createdBy as UserSummaryDto), reason: 'Needs revision' as const }));
            const seen = new Set<number>();
            return [...unassigned, ...needs].filter(s => (seen.has(s.id) ? false : (seen.add(s.id), true)));
        }),
        shareReplay({ bufferSize: 1, refCount: true })
    );
    // -----------------------------------------------

    ngOnInit(): void {
        // Student-facing data remains
        this.subscriptions.push(
            this.activeAssignment$.subscribe({
                next: (activeAssignment) => {
                    if (activeAssignment) {
                        const assignmentId = activeAssignment.assignment.id;

                        this.subscriptions.push(
                            this.announcementService.getAnnouncements(assignmentId).subscribe({
                                next: (announcements) => (this.announcements = announcements),
                                error: (err) => console.error('Failed to load announcements', err)
                            })
                        );

                        this.subscriptions.push(
                            this.projectService.getProjectByUserAndAssignmentId(assignmentId.toString()).subscribe({
                                next: (project) => (this.project = project)
                            })
                        );

                        this.loadDeadlinesForAssignment();
                    }
                },
                error: (err) => console.error('Failed to load active assignment', err)
            })
        );
    }

    loadDeadlinesForAssignment(): void {
        const activeAssignment = this.activeAssignmentService.getActiveAssignment();
        const assignmentId = activeAssignment?.assignment.id;
        if (assignmentId) {
            this.deadlines$ = this.deadlineService.getAllDeadlinesForAssignment(assignmentId);
        }
    }

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

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
