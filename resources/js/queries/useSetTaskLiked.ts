import {useMutation, useQueryClient} from "@tanstack/react-query";
import {setTaskLiked} from "@/services/TasksService";
import {Task} from "@/Models/Task";

export const useUpdateIsLiked = (key = "tasks", query?: any) => {
    const queryClient = useQueryClient();
    const queryKeyArray = [key];
    if (query) {
        queryKeyArray.push(query);
    }
    return useMutation(
        setTaskLiked,
        {
            // When mutate is called:
            onMutate: async (taskId: string) => {
                await queryClient.cancelQueries(queryKeyArray);
                const previousTasks = queryClient.getQueryData<Task[]>(queryKeyArray);
                if (previousTasks) {
                    const taskToUpdateIndex = previousTasks.findIndex(task => task.id.toString() === taskId);
                    const tasksToUpdate = JSON.parse(JSON.stringify(previousTasks));
                    const hasLiked = tasksToUpdate[taskToUpdateIndex].has_liked;
                    if (hasLiked) {
                        tasksToUpdate[taskToUpdateIndex].likers_count -= 1;
                    } else {
                        tasksToUpdate[taskToUpdateIndex].likers_count += 1;
                    }
                    tasksToUpdate[taskToUpdateIndex].has_liked = !hasLiked;

                    queryClient.setQueryData<Task[]>(queryKeyArray, [
                        ...tasksToUpdate,
                    ])
                }
                return previousTasks ? {previousTasks} : {previousTasks: []};
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err, variables, context) => {
                if (context) {
                    queryClient.setQueryData<Task[]>(queryKeyArray, [...context.previousTasks])
                }
            },
            // Always refetch after error or success:
            onSuccess: () => {
            },
        },
    )
}
