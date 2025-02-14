import { User } from "../../auth/models/user.model"
import { ApplicationStatusEnum } from "./ApplicationStatus.enum"
import { Project } from "./project.model"
export interface Application {
    id: number,
    motivationMd: string,
    status: ApplicationStatusEnum,
    project: Project,
    applicant: User
}

export interface ApplicationCreate {
    motivationMd: string,
}
