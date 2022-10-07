import {Category} from "./Category";
import {Toy} from "./Toy";
import {User} from "./User";
import {TaskComment} from "@/Models/TaskComment";

export interface Task {
    id: number;
    title: string;
    excerpt: string;
    category_id: number;
    author_id: number;
    slug: string;
    content: string;
    comments?: TaskComment[];
    is_published: boolean;
    created_at: string | null;
    updated_at: string | null;
    category?: Category | null;
    author?: User | null;
    toys?: Array<Toy> | null;
    toys_count?: number | null;
    has_favorited?: boolean;
    has_liked?: boolean;
    likers_count?: number;
}
