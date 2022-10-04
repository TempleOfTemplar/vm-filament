import {Task} from "@/Models/Task";
import api from "@/utils/Api";
import {Tag} from "@/Models/Tag";

export async function fetchTags(): Promise<Tag[]> {
    const res = await api().get('/api/tags')
    return res.data
}
