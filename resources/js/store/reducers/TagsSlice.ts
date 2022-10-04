import rootApi from "../api/RootApi";
import {Tag} from "@/Models/Tag";

export const tagsApi = rootApi.injectEndpoints({
    endpoints: (build) => ({
        getApiTags: build.query<Tag[], void>({
            query: () => ({url: `/api/tags`, method: "GET"}),
            // transformResponse: (rawResult: { data: Tag[] }, meta) => {
            //     return rawResult.data;
            // }
        }),
        postApiTags: build.mutation<PostApiTagsApiResponse, PostApiTagsApiArg>({
            query: (queryArg) => ({
                url: `/api/tags`,
                method: "POST",
                body: queryArg.body,
            }),
        }),
        getApiTagsByTag: build.query<GetApiTagsByTagApiResponse,
            GetApiTagsByTagApiArg>({
            query: (queryArg) => ({url: `/api/tags/${queryArg.tag}`, method: "GET"}),
        }),
        putApiTagsByTag: build.mutation<PutApiTagsByTagApiResponse,
            PutApiTagsByTagApiArg>({
            query: (queryArg) => ({
                url: `/api/tags/${queryArg.tag}`,
                method: "PUT",
                body: queryArg.body,
            }),
        }),
        patchApiTagsByTag: build.mutation<PatchApiTagsByTagApiResponse,
            PatchApiTagsByTagApiArg>({
            query: (queryArg) => ({
                url: `/api/tags/${queryArg.tag}`,
                method: "PATCH",
                body: queryArg.body,
            }),
        }),
        deleteApiTagsByTag: build.mutation<DeleteApiTagsByTagApiResponse,
            DeleteApiTagsByTagApiArg>({
            query: (queryArg) => ({
                url: `/api/tags/${queryArg.tag}`,
                method: "DELETE",
            }),
        }),
    }),
    overrideExisting: false
});

export type GetApiTagsApiResponse = unknown;
export type GetApiTagsApiArg = void;
export type PostApiTagsApiResponse = unknown;
export type PostApiTagsApiArg = {
    body: {
        name: string;
        slug: string;
        type?: string;
        order_column?: string;
        created_at?: string;
        updated_at?: string;
    };
};
export type GetApiTagsByTagApiResponse = unknown;
export type GetApiTagsByTagApiArg = {
    tag: string;
};
export type PutApiTagsByTagApiResponse = unknown;
export type PutApiTagsByTagApiArg = {
    tag: string;
    body: {
        name: string;
        slug: string;
        type?: string;
        order_column?: string;
        created_at?: string;
        updated_at?: string;
    };
};
export type PatchApiTagsByTagApiResponse = unknown;
export type PatchApiTagsByTagApiArg = {
    tag: string;
    body: {
        name: string;
        slug: string;
        type?: string;
        order_column?: string;
        created_at?: string;
        updated_at?: string;
    };
};
export type DeleteApiTagsByTagApiResponse = unknown;
export type DeleteApiTagsByTagApiArg = {
    tag: string;
};

export const {
    useGetApiTagsQuery,
    useGetApiTagsByTagQuery,
    usePostApiTagsMutation,
    usePatchApiTagsByTagMutation,
    usePutApiTagsByTagMutation,
    useDeleteApiTagsByTagMutation
} = tagsApi;
