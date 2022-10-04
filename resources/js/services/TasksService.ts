import {Task} from "@/Models/Task";
import api from "@/utils/Api";

export async function fetchTasks(): Promise<Task[]> {
    const res = await api().get('/api/tasks')
    return res.data;
}

export async function editTask(taskId: string, changes: Task): Promise<Task> {
    const res = await api().patch(`/api/tasks/${taskId}`, changes);
    return res.data;
}
