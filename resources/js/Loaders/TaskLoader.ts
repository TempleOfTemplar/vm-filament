import {QueryClient} from "@tanstack/react-query";
import {fetchTaskById} from "@/services/TasksService";

const contactDetailQuery = (id: string): any => ({
    queryKey: ["tasks", id],
    queryFn: async () => {
        const task = await fetchTaskById(id);
        if (!task) {
            throw new Response("", {
                status: 404,
                statusText: "Not Found",
            });
        }
        return task;
    },
});

export const taskLoader =
    (queryClient: QueryClient) =>
        async ({ params }) => {
            const query = contactDetailQuery(params.taskId);
            return (
                queryClient.getQueryData(query) ?? (await queryClient.fetchQuery(query))
            );
        };
