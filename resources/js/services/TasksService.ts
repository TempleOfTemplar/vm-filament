import {Task} from "@/Models/Task";
import api from "@/utils/Api";

export async function fetchTasks(filterData: any): Promise<Task[]> {
    const [, filters] = filterData.queryKey;
    const res = await api().get('/api/tasks', {params: filters})
    return res.data;
}

export async function getTaskById(id: string | undefined): Promise<Task> {
    const res = await api().get(`/api/tasks/${id}`)
    return res.data;
}

export async function editTask(changes: Task): Promise<Task> {
    const res = await api().patch(`/api/tasks/${changes.id}`, changes);
    return res.data;
}

export async function createTask(data: Task): Promise<Task> {
    const res = await api().post(`/api/tasks`, data);
    return res.data;
}

export async function setTaskFavorite(taskId: string): Promise<Task> {
    const res = await api().patch(`/api/tasks/favorite/${taskId}`, {});
    return res.data;
}
