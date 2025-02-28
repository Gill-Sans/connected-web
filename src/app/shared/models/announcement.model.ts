import {User} from '../../auth/models/user.model';

export interface Announcement {
    id: number;
    assignmentId: number;
    title: string;
    message: string;
    createdBy: User;
    createdAt: Date;
}
