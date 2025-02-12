import { tag } from './tag.model';
import { User } from '../../auth/models/user.model';

export interface Project {
    id: number;
    title: string;
    description: string;
    status: string;
    repositoryUrl: string;
    boardUrl: string;
    backgroundImage: string;

    assignmentId: number;
    tags: tag[];
    createdBy: User;
    members: User[];
}
