import {Category} from "./Category";
import {Toy} from "./Toy";
import {User} from "./User";

export interface Task {
    id: number;
    title: string;
    excerpt: string;
    category_id: number;
    author_id: number;
    slug: string;
    content: string;
    is_published: boolean;
    created_at: string | null;
    updated_at: string | null;
    category?: Category | null;
    author?: User | null;
    toys?: Array<Toy> | null;
    toys_count?: number | null;
    has_favorited?: boolean;
}
