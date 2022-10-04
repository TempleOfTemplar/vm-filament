import {Task} from "@/Models/Task";
import api from "@/utils/Api";
import {Category} from "@/Models/Category";

export async function fetchCategories(): Promise<Category[]> {
    const res = await api().get('/api/categories')
    return res.data
}
