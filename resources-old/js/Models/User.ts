export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    password: string | null;
    google_id: string | null;
    vk_id: string | null;
    avatar: string | null;
    remember_token: string | null;
    created_at: string | null;
    updated_at: string | null;
}
