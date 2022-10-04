import rootApi from "../api/RootApi";
import {Category} from "@/Models/Category";

export const categoriesApi = rootApi.injectEndpoints({
    endpoints: (build) => ({
        getApiCategories: build.query<Category[], void>({
            query: () => ({url: `/api/categories`, method: "GET"}),
            // transformResponse: (rawResult: { data: Category[] }, meta) => {
            //     return rawResult.data;
            // },
        }),
        postApiCategories: build.mutation<PostApiCategoriesApiResponse,
            PostApiCategoriesApiArg>({
            query: (queryArg) => ({
                url: `/api/categories`,
                method: "POST",
                body: queryArg.body,
            }),
        }),
        getApiCategoriesByCategory: build.query<Category,
            string>({
            query: (categoryId) => ({url: `/api/categories/${categoryId}`, method: "GET"}),
            // transformResponse: (rawResult: { data: Category }, meta) => {
            //     return rawResult.data;
            // },
        }),
        putApiCategoriesByCategory: build.mutation<PutApiCategoriesByCategoryApiResponse,
            PutApiCategoriesByCategoryApiArg>({
            query: (queryArg) => ({
                url: `/api/categories/${queryArg.category}`,
                method: "PUT",
                body: queryArg.body,
            }),
        }),
        patchApiCategoriesByCategory: build.mutation<PatchApiCategoriesByCategoryApiResponse,
            PatchApiCategoriesByCategoryApiArg>({
            query: (queryArg) => ({
                url: `/api/categories/${queryArg.category}`,
                method: "PATCH",
                body: queryArg.body,
            }),
        }),
        deleteApiCategoriesByCategory: build.mutation<DeleteApiCategoriesByCategoryApiResponse,
            DeleteApiCategoriesByCategoryApiArg>({
            query: (queryArg) => ({
                url: `/api/categories/${queryArg.category}`,
                method: "DELETE",
            }),
        }),
    }),
    overrideExisting: false
});

export type GetApiCategoriesApiResponse = unknown;
export type GetApiCategoriesApiArg = void;
export type PostApiCategoriesApiResponse = unknown;
export type PostApiCategoriesApiArg = {
    body: {
        title: string;
        slug: string;
        created_at?: string;
        updated_at?: string;
    };
};
export type GetApiCategoriesByCategoryApiResponse = unknown;
export type GetApiCategoriesByCategoryApiArg = {
    category: string;
};
export type PutApiCategoriesByCategoryApiResponse = unknown;
export type PutApiCategoriesByCategoryApiArg = {
    category: string;
    body: {
        title: string;
        slug: string;
        created_at?: string;
        updated_at?: string;
    };
};
export type PatchApiCategoriesByCategoryApiResponse = unknown;
export type PatchApiCategoriesByCategoryApiArg = {
    category: string;
    body: {
        title: string;
        slug: string;
        created_at?: string;
        updated_at?: string;
    };
};
export type DeleteApiCategoriesByCategoryApiResponse = unknown;
export type DeleteApiCategoriesByCategoryApiArg = {
    category: string;
};

export const {
    useGetApiCategoriesQuery,
    useGetApiCategoriesByCategoryQuery,
    usePostApiCategoriesMutation,
    usePatchApiCategoriesByCategoryMutation,
    usePutApiCategoriesByCategoryMutation,
    useDeleteApiCategoriesByCategoryMutation
} = categoriesApi;
