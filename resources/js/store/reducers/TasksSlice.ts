import rootApi from "../api/RootApi";
import {Task} from "@/Models/Task";

export const tasksApi = rootApi.injectEndpoints({
    endpoints: (build) => ({
        getApiTasks: build.query<Task[], {
            search?: string | null,
            category?: string | null,
            toys?: (string | null)[] | null,
            tags?: (string | null)[] | null
        }>({
            query: (filtersData) => {
                return {url: `/api/tasks`, method: "GET", params: filtersData}
            },
            // transformResponse: (rawResult: { data: Task[] }, meta) => {
            //     return rawResult.data;
            // },
            providesTags: (result, error, arg) => {
                return result
                    ? [...result.map(({ id }) => ({ type: 'Task' as const, id }))]
                    : ['Task']
            }
        }),
        postApiTasks: build.mutation<PostApiTasksApiResponse, PostApiTasksApiArg>({
            query: (queryArg) => ({
                url: `/api/tasks`,
                method: "POST",
                body: queryArg.body,
            }),
        }),
        getApiTasksByTask: build.query<Task,
            string>({
            query: (taskId) => ({url: `/api/tasks/${taskId}`, method: "GET"}),
            // transformResponse: (rawResult: { data: Task }, meta) => {
            //     return rawResult.data;
            // },
            providesTags: (result, error, taskId) => [{ type: 'Task', id: taskId }],
        }),
        putApiTasksByTask: build.mutation<PutApiTasksByTaskApiResponse,
            PutApiTasksByTaskApiArg>({
            query: (queryArg) => ({
                url: `/api/tasks/${queryArg.task}`,
                method: "PUT",
                body: queryArg.body,
            }),
        }),
        patchApiTasksByTask: build.mutation<Task,
            PatchApiTasksByTaskApiArg>({
            query: (queryArg) => ({
                url: `/api/tasks/${queryArg.taskId}`,
                method: "PATCH",
                body: queryArg.body,
            }),
            // transformResponse: (rawResult: { data: Task }, meta) => {
            //     return rawResult.data;
            // }
        }),
        deleteApiTasksByTask: build.mutation<DeleteApiTasksByTaskApiResponse,
            DeleteApiTasksByTaskApiArg>({
            query: (queryArg) => ({
                url: `/api/tasks/${queryArg.task}`,
                method: "DELETE",
            }),
        }),
        setTaskFavorite: build.mutation<Task,
            string>({
            query: (taskId) => ({
                url: `/api/tasks/favorite/${taskId}`,
                method: "PATCH",
            }),
            // transformResponse: (rawResult: { data: Task }, meta) => {
            //     return rawResult.data;
            // },
            invalidatesTags: (result, error, taskId) => [{ type: 'Task', id: taskId }],
        }),
    }),
    overrideExisting: false
});
export type PostApiTasksApiResponse = unknown;
export type PostApiTasksApiArg = {
    body: {
        title: string;
        excerpt: string;
        category_id: string;
        author_id: string;
        slug: string;
        content: string;
        is_published: boolean;
        created_at?: string;
        updated_at?: string;
    };
};
export type GetApiTasksByTaskApiResponse = unknown;
export type GetApiTasksByTaskApiArg = {
    task: string;
};
export type PutApiTasksByTaskApiResponse = unknown;
export type PutApiTasksByTaskApiArg = {
    task: string;
    body: {
        title: string;
        excerpt: string;
        category_id: string;
        author_id: string;
        slug: string;
        content: string;
        is_published: boolean;
        created_at?: string;
        updated_at?: string;
    };
};
export type PatchApiTasksByTaskApiResponse = unknown;
export type PatchApiTasksByTaskApiArg = {
    taskId: string;
    body: {
        title: string;
        excerpt: string;
        category_id: string;
        author_id: string;
        slug: string;
        content: string;
        is_published: boolean;
        created_at?: string;
        updated_at?: string;
    };
};
export type DeleteApiTasksByTaskApiResponse = unknown;
export type DeleteApiTasksByTaskApiArg = {
    task: string;
};

export const {
    useGetApiTasksQuery,
    usePostApiTasksMutation,
    useGetApiTasksByTaskQuery,
    useDeleteApiTasksByTaskMutation,
    usePatchApiTasksByTaskMutation,
    usePutApiTasksByTaskMutation,
    useSetTaskFavoriteMutation
} = tasksApi
