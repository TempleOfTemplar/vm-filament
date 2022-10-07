import {User} from "@/Models/User";

export interface TaskComment {
    commentable_id: string|null;
    commentable_type: string;
    content: string;
    created_at: Date;
    deleted_at: Date;
    id: string;
    parent_id: string|null;
    updated_at: Date;
    user: User;
}
