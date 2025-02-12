import { Assignment } from "./assignment.model";
import { Course } from "./course.model";

export interface ActiveAssignment {
    assignment: Assignment;
    course: Course;
}