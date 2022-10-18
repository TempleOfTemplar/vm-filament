// import {useInfiniteQuery, UseInfiniteQueryOptions} from "@tanstack/react-query";
//
// export const useGetStatisticsInfiniteQuery = <TData = any, TError = unknown>(
//     variables?: any,
//     options?: UseInfiniteQueryOptions<any, TError, TData>,
// ) =>
//     useInfiniteQuery<any, TError, TData>(
//         ['getStatistics', variables],
//         fetcher<GetStatisticsQuery, GetStatisticsQueryVariables>(
//             GetStatisticsDocument,
//             variables,
//         ),
//         options,
//     )
