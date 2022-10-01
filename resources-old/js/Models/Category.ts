import {Task} from "./Task";

export interface Category {
    id: number;
    title: string;
    slug: string;
    created_at: string | null;
    updated_at: string | null;
    tasks?: Array<Task> | null;
    tasks_count?: number | null;
}
