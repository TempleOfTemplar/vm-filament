import rootApi from "../api/RootApi";
import {Toy} from "@/Models/Toy";

export const toysApi = rootApi.injectEndpoints({
    endpoints: (build) => ({
        getApiToys: build.query<Toy[], void>({
            query: () => ({url: `/api/toys`, method: "GET"}),
            // transformResponse: (rawResult: { data: Toy[] }, meta) => {
            //     return rawResult.data;
            // },
        }),
        postApiToys: build.mutation<PostApiToysApiResponse, PostApiToysApiArg>({
            query: (queryArg) => ({
                url: `/api/toys`,
                method: "POST",
                body: queryArg.body,
            }),
        }),
        getApiToysByToy: build.query<GetApiToysByToyApiResponse,
            GetApiToysByToyApiArg>({
            query: (queryArg) => ({url: `/api/toys/${queryArg.toy}`, method: "GET"}),
        }),
        putApiToysByToy: build.mutation<PutApiToysByToyApiResponse,
            PutApiToysByToyApiArg>({
            query: (queryArg) => ({
                url: `/api/toys/${queryArg.toy}`,
                method: "PUT",
                body: queryArg.body,
            }),
        }),
        patchApiToysByToy: build.mutation<PatchApiToysByToyApiResponse,
            PatchApiToysByToyApiArg>({
            query: (queryArg) => ({
                url: `/api/toys/${queryArg.toy}`,
                method: "PATCH",
                body: queryArg.body,
            }),
        }),
        deleteApiToysByToy: build.mutation<DeleteApiToysByToyApiResponse,
            DeleteApiToysByToyApiArg>({
            query: (queryArg) => ({
                url: `/api/toys/${queryArg.toy}`,
                method: "DELETE",
            }),
        }),
    }),
    overrideExisting: false
});

export type GetApiToysApiResponse = unknown;
export type GetApiToysApiArg = void;
export type PostApiToysApiResponse = unknown;
export type PostApiToysApiArg = {
    body: {
        title: string;
        description?: string;
        slug: string;
        created_at?: string;
        updated_at?: string;
        image?: string;
    };
};
export type GetApiToysByToyApiResponse = unknown;
export type GetApiToysByToyApiArg = {
    toy: string;
};
export type PutApiToysByToyApiResponse = unknown;
export type PutApiToysByToyApiArg = {
    toy: string;
    body: {
        title: string;
        description?: string;
        slug: string;
        created_at?: string;
        updated_at?: string;
        image?: string;
    };
};
export type PatchApiToysByToyApiResponse = unknown;
export type PatchApiToysByToyApiArg = {
    toy: string;
    body: {
        title: string;
        description?: string;
        slug: string;
        created_at?: string;
        updated_at?: string;
        image?: string;
    };
};
export type DeleteApiToysByToyApiResponse = unknown;
export type DeleteApiToysByToyApiArg = {
    toy: string;
};

export const {
    useGetApiToysQuery,
    useGetApiToysByToyQuery,
    usePostApiToysMutation,
    usePatchApiToysByToyMutation,
    usePutApiToysByToyMutation,
    useDeleteApiToysByToyMutation
} = toysApi;
