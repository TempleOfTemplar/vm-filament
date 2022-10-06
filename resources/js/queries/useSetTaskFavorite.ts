import {useMutation, useQueryClient} from "@tanstack/react-query";
import {setTaskFavorite} from "@/services/TasksService";
import {Task} from "@/Models/Task";

export const useUpdateIsFavorite = (query: any) => {
    const queryClient = useQueryClient();

    return useMutation(
        setTaskFavorite,
        {

            // When mutate is called:
            onMutate: async (taskId: string) => {
                await queryClient.cancelQueries(['tasks', query]);
                const previousTasks = queryClient.getQueryData<Task[]>(["tasks", query]);
                if (previousTasks) {
                    const taskToUpdateIndex = previousTasks.findIndex(task => task.id.toString() === taskId);
                    const tasksToUpdate = JSON.parse(JSON.stringify(previousTasks));
                    tasksToUpdate[taskToUpdateIndex].has_favorited = !tasksToUpdate[taskToUpdateIndex].has_favorited;
                    queryClient.setQueryData<Task[]>(["tasks", query], [
                        ...tasksToUpdate,
                    ])
                }
                return previousTasks ? {previousTasks} : {previousTasks: []};
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err, variables, context) => {
                if (context) {
                    queryClient.setQueryData<Task[]>(['tasks'], [...context.previousTasks])
                }
            },
            // Always refetch after error or success:
            onSettled: () => {
            },
        },
    )
}
