import {Task} from "./Task";

export interface Tag {
    id: number;
    name: {[localeKey: string]: string};
    slug: string;
    created_at: any | null;
    updated_at: any | null;
    tasks?: Array<Task> | null;
    tasks_count?: number | null;
}
