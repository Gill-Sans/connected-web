import {Assignment} from './assignment.model';

export interface Course {
    id: number
    canvasId: number
    uuid: string
    name: string
    start_at: Date
    end_at: Date
    owner_id: number
    assignments: Assignment[]
}

