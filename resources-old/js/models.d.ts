/**
 * This file is auto generated using 'php artisan typescript:generate'
 *
 * Changes to this file will be lost when the command is run again
 */

declare namespace App.Models {
    export interface Category {
        id: number;
        title: string;
        slug: string;
        created_at: string | null;
        updated_at: string | null;
        tasks?: Array<App.Models.Task> | null;
        tasks_count?: number | null;
    }

    export interface Tag {
        id: number;
        name: Array<any> | any;
        slug: Array<any> | any;
        type: string | null;
        order_column: number | null;
        created_at: string | null;
        updated_at: string | null;
    }

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
        category?: App.Models.Category | null;
        author?: App.Models.User | null;
        toys?: Array<App.Models.Toy> | null;
        toys_count?: number | null;
    }

    export interface Toy {
        id: number;
        title: string;
        description: string | null;
        slug: string;
        created_at: string | null;
        updated_at: string | null;
        tasks?: Array<App.Models.Task> | null;
        image?: FilamentCurator.Models.Media | null;
        tasks_count?: number | null;
    }

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

}
