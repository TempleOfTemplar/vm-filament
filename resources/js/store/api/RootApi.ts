import {axiosBaseQuery} from "../axiosBaseQuery";
import {createApi} from "@reduxjs/toolkit/query/react";

const rootApi = createApi({
    reducerPath: 'api',
    baseQuery: axiosBaseQuery({
        baseUrl: '',
    }),
    tagTypes: ['Task', 'Toy', 'Category', 'Tag'],
    endpoints: builder => ({})
})

export default rootApi;
