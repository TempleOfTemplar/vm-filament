import {Category} from "./Category";
import {Toy} from "./Toy";
import {Tag} from "./Tag";
import {User} from "./User";

export interface Task {
    id: number;
    title: string;
    excerpt: string;
    category_id: number;
    slug: string;
    content: string;
    is_published: boolean;
    created_at: any | null;
    updated_at: any | null;
    category?: Category | null;
    toys?: Array<Toy> | null;
    tags?: Array<Tag> | null;
    author?: User | null;
    toys_count?: number | null;
    tags_count?: number | null;
    has_favorited: boolean;
}
