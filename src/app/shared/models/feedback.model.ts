
import { User } from '../../auth/models/user.model';
import { Project } from './project.model';

export interface Feedback {
    id: number;
    comment: string;
    user: User;
    project: Project;
    createdAt: Date;
    updatedAt: Date;
}

export interface createFeedback {
    comment: string;
}