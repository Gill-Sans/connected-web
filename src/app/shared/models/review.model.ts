import {User} from '../../auth/models/user.model';
import {ReviewStatusEnum} from './ReviewStatus.enum';
import {Project} from './project.model';

export interface Review {
    id: number;
    status: ReviewStatusEnum;
    reviewer: User;
    project: Project;
}

export interface CreateReview {
    status: ReviewStatusEnum;
}
