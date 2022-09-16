export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: any | null;
    password: string | null;
    google_id: string | null;
    vk_id: string | null;
    avatar: string | null;
    remember_token: string | null;
    created_at: any | null;
    updated_at: any | null;
    permissions: Array<any> | any | null;
    roles?: Array<any> | null;
    notifications_count?: number | null;
    read_notifications_count?: number | null;
    unread_notifications_count?: number | null;
    roles_count?: number | null;
}
