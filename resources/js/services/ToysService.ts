import {Task} from "@/Models/Task";
import api from "@/utils/Api";
import {Toy} from "@/Models/Toy";

export async function fetchToys(): Promise<Toy[]> {
    const res = await api().get('/api/toys')
    return res.data
}
