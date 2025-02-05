import {Role} from './role.model';

export interface User {
    id: Number,
    firstName: String,
    lastName: String,
    email: String,
    avatarUrl: String,
    role: Role,
}
