export interface BugCreate {
    description: string;
    route?: string | null;
    appVersion?: string | null;
}
