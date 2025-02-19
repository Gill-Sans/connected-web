import { tag } from './tag.model';
import { User } from '../../auth/models/user.model';
import { ProjectStatusEnum } from "./ProjectStatus.enum"
import { Assignment } from "./assignment.model"

export interface Project {
    id: number;
    title: string;
    description: string;
    shortDescription: string;
    status: ProjectStatusEnum;
    repositoryUrl: string;
    boardUrl: string;
    backgroundImage: string;
    teamSize: number;

    assignment: Assignment;
    tags: tag[];
    createdBy: User;
    members: User[];
}
