import {useQuery} from "@tanstack/react-query";
import {fetchTasks} from "@/services/TasksService";

export default function useTasksQuery(query?: any) {
    return useQuery(["tasks", query], fetchTasks, {keepPreviousData: true})
};
