import {Task} from "./Task";

export interface Toy {
    id: number;
    title: string;
    description: string;
    image: any;
    slug: string;
    created_at: any | null;
    updated_at: any | null;
    tasks?: Array<Task> | null;
    tasks_count?: number | null;
}
