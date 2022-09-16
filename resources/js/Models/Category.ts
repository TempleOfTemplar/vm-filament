import {Task} from "./Task";

export interface Category {
    id: number;
    title: string;
    slug: string;
    created_at: any | null;
    updated_at: any | null;
    tasks?: Array<Task> | null;
    tasks_count?: number | null;
}