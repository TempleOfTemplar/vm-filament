import {useQuery} from "@tanstack/react-query";
import {fetchTaskComments} from "@/services/TasksService";

export default function useTaskCommentsQuery(taskId?: string) {
    return useQuery<Comment[]>(["comments", taskId], fetchTaskComments, {keepPreviousData: false, enabled: taskId !== undefined})
};
