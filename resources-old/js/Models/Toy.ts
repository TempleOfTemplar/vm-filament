import {Task} from "./Task";

export interface Toy {
    id: number;
    title: string;
    description: string | null;
    slug: string;
    created_at: string | null;
    updated_at: string | null;
    tasks?: Array<Task> | null;
    image?: any | null;
    tasks_count?: number | null;
}
