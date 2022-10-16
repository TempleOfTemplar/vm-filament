import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addTaskComment} from "@/services/TasksService";
import {Comment} from "postcss";

export const useAddTaskCommentMutation = () => {
    const queryClient = useQueryClient();
    let taskId: string;
    return useMutation(
        addTaskComment,
        {
            // When mutate is called:
            onMutate: async (data: { taskId: string }) => {
                console.log("MUTATE", data);
                taskId = data.taskId;
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err, variables, context) => {
                // if (context) {
                //     queryClient.setQueryData<Task[]>(queryKeyArray, [...context.previousTasks])
                // }
            },
            // Always refetch after error or success:
            onSuccess: (addedComment: Comment) => {
                console.log("addedComment", addedComment)
                if(taskId !== undefined) {
                    queryClient.invalidateQueries(["comments", taskId])
                }

            },
        },
    )
}
