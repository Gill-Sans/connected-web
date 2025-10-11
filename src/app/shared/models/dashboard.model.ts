import {ProjectStatusEnum} from './ProjectStatus.enum';

export interface DashboardDetailsDto {
    counts: {
        totalStudents: number;
        assignedStudents: number;
        unassignedStudents: number;
        reviewQueueProjects: number;
        needsRevisionProjects: number;
        pendingApplications: number;
    };
    lists: {
        reviewQueue: ProjectSummaryDto[];
        needsRevision: ProjectSummaryDto[];
        unassignedStudents: UserSummaryDto[];
    };
}

export interface ProjectSummaryDto {
    id: number;
    title: string;
    status: ProjectStatusEnum;
    createdBy?: UserSummaryDto;
}

export interface UserSummaryDto {
    id: number;
    firstName: string;
    lastName: string;
}
