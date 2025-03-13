import { User } from "../../auth/models/user.model";

export interface Notification {

    notificationId: number;
    user: User;
    message: String;
    isRead: boolean;
    timestamp: Date;
    destinationUrl: String;
}