import {Role} from './role.model';
import { tag } from '../../shared/models/tag.model';

export interface User {
    id: number,
    firstName?: string,
    lastName?: string,
    email: string,
    avatarUrl?: string,
    role: Role,
    linkedinUrl?: string,
    fieldOfStudy?: string,
    aboutMe?: string,
    tags?: tag[],
}
