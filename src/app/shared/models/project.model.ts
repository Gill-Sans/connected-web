import { Assignment } from "./assignment.model"
import { ProjectStatusEnum } from "./ProjectStatus.enum"

export interface Project {
    id: number
    title: string
    description: string
    status: ProjectStatusEnum
    repositoryUrl: string
    boardUrl: string
    backgroundImage: string
    assignment : Assignment
}
