import {Task} from "@/Models/Task";
import api from "@/utils/Api";

export async function fetchTasks(filterData: any): Promise<Task[]> {
    const [, filters] = filterData.queryKey;
    const res = await api().get('/api/tasks', {params: filters})
    return res.data;
}

export async function fetchMyTasks(): Promise<Task[]> {
    const res = await api().get('/api/tasks/my')
    return res.data;
}

export async function fetchFavoriteTasks(): Promise<Task[]> {
    const res = await api().get('/api/tasks/favorite')
    return res.data;
}

export async function getTaskById(id?: string): Promise<Task> {
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
    const res = await api().patch(`/api/tasks/${taskId}/favorite`, {});
    return res.data;
}

export async function setTaskLiked(taskId: string): Promise<Task> {
    const res = await api().patch(`/api/tasks/${taskId}/like`, {});
    return res.data;
}

export async function fetchTaskComments(taskQuery: any): Promise<Comment[]> {
    const [, taskId] = taskQuery.queryKey;
    const res = await api().get(`/api/tasks/${taskId}/comments`);
    return res.data;
}

export async function addTaskComment(data: { taskId: string, comment: string }): Promise<Comment> {
    const res = await api().post(`/api/tasks/${data.taskId}/addComment`, data);
    return res.data;
}
