import { Role } from './role.model';
import { tag } from '../../shared/models/tag.model';
import { Application } from '../../shared/models/application.model';

export interface User {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    profileImageUrl?: string,
    role: Role,
    isVerified: boolean,
    linkedinUrl?: string,
    fieldOfStudy?: string,
    aboutMe?: string,
    tags?: tag[],
    applications?: Application[]
}
