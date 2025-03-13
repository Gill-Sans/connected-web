import {Assignment} from './assignment.model';
import {DeadlineRestrictionEnum} from './DeadlineRestriction.enum';

export interface Deadline {
    id: number;
    title: string;
    dueDate: string;
    description: string;
    restriction: DeadlineRestrictionEnum;
    timeZone: string;
    assignment: Assignment;

}
