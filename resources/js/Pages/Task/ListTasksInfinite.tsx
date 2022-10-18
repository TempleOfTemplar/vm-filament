import React, {ChangeEvent, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
    Affix,
    Button,
    Container,
    createStyles,
    Group,
    keyframes,
    MultiSelect,
    Select,
    Space,
    Stack,
    TextInput,
    Title
} from "@mantine/core";
import {IconCirclePlus, IconSearch} from "@tabler/icons";
import useDebounce from "../../Hooks/useDebounce";
import {Task} from "@/Models/Task";
import {Tag} from "@/Models/Tag";
import {Toy} from "@/Models/Toy";
import {Category} from "@/Models/Category";
import {ArrayParam, StringParam, useQueryParams} from "use-query-params";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {fetchTasksWithPagination} from "@/services/TasksService";
import {fetchToys} from "@/services/ToysService";
import {fetchTags} from "@/services/TagsService";
import {fetchCategories} from "@/services/CategoriesService";
import {useUpdateIsFavorite} from "@/queries/useSetTaskFavorite";
import {useUpdateIsLiked} from "@/queries/useSetTaskLiked";
import {useInView} from "react-intersection-observer";
import TaskCard from "@/Components/TaskCard";
import {TasksCursorPaginator} from "@/Models/CursorPaginator";
import {VirtuosoGrid} from 'react-virtuoso'

export const bounce = keyframes({
    '0%': {
        transform: 'rotateY(20deg) rotateX(-35deg) translate(300px, 300px) skew(35deg, -10deg)',
        opacity: 0
    },
    '100%': {
        transform: 'rotateY(0) rotateX(0deg) translate(0, 0) skew(0deg, 0deg)',
        opacity: 1
    }
});

export const slideInElleptic = keyframes({
    '0%': {
        transform: 'translateY(600px) rotateX(30deg) scale(0)',
        transformOrigin: '50% 100%',
        opacity: 0
    },
    '100%': {
        transform: 'translateY(0) rotateX(0) scale(1)',
        transformOrigin: '50% -1400px',
        opacity: 1
    }
});

const useStyles = createStyles((theme) => ({
    gridList: {
        display: "flex",
        flexWrap: "wrap"
    },
    gridItem: {
        width: "100%",
        animation: `${bounce} 0.6s cubic-bezier(0.250, 0.460, 0.450, 0.940) both`,
        [`@media (min-width: 768px)`]: {
            width: 'calc(100% / 2)'
        },
        [`@media (min-width: 1024px)`]: {
            width: 'calc(100% / 3)'
        },
    },
}));

//href={route("tasks.edit", id)}
const ListTasksInfinite = () => {
    const {ref, inView} = useInView()
    const parentRef = useRef<any>()
    const {classes, theme} = useStyles();
    const {
        status,
        data: tasksPaginationData,
        error: tasksError,
        isFetching: tasksLoading,
        isFetchingNextPage,
        isFetchingPreviousPage,
        fetchNextPage,
        fetchPreviousPage,
        hasNextPage,
        hasPreviousPage,
    } = useInfiniteQuery<TasksCursorPaginator>(
        ['tasks'],
        fetchTasksWithPagination,
        {
            getPreviousPageParam: (firstPage) => {
                // console.log("firstPage", firstPage);
                return firstPage.prev_cursor
            },
            getNextPageParam: (lastPage) => {
                console.log("lastPage", lastPage);
                return lastPage.next_cursor
            },
        },
    )


    // React.useEffect(() => {
    //     if (inView) {
    //         fetchNextPage()
    //     }
    // }, [inView])


    // React.useEffect(() => {
    //     const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse()
    //
    //     if (!lastItem) {
    //         return
    //     }
    //
    //     if (
    //         lastItem.index >= data?.pages.length - 1 &&
    //         hasNextPage &&
    //         !isFetchingNextPage
    //     ) {
    //         fetchNextPage()
    //     }
    // }, [
    //     hasNextPage,
    //     fetchNextPage,
    //     data,
    //     isFetchingNextPage,
    //     rowVirtualizer.getVirtualItems(),
    // ])


    const [query, setQuery] = useQueryParams({
        search: StringParam,
        category: StringParam,
        toys: ArrayParam,
        tags: ArrayParam,
    }, {});
    const updateIsFavorite = useUpdateIsFavorite("tasks", query);
    const updateIsLiked = useUpdateIsLiked("tasks", query);


    const [firstTasksLoaded, setFirstTasksLoaded] = useState<boolean>(false);

    const {search, category, toys, tags} = query;
    // const {
    //     isLoading: tasksLoading,
    //     error: tasksError,
    //     data: tasksList,
    //     isFetching: tasksFetching
    // } = useQuery(["tasks", query], fetchTasks, {keepPreviousData: true});
    const tasksList: Task[] = (tasksPaginationData as any)?.pages ? (tasksPaginationData as any).pages.map((page: any) => page.data).flat() : [];
    // const tasksList: Task[] = useMemo(() => {
    //     return (tasksPaginationData as any)?.pages ? (tasksPaginationData as any).pages[0].data : [];
    // }, [tasksPaginationData]);
    console.log("tasksList", tasksList);

    const loadMore = useCallback(() => {
        console.log("LOAD MORE");
        fetchNextPage();
    }, []);
    // const rowVirtualizer = useVirtualizer({
    //     count: hasNextPage ? tasksList.length + 1 : tasksList.length,
    //     getScrollElement: () => parentRef?.current,
    //     estimateSize: () => 467,
    //     horizontal: false,
    //     overscan: 6,
    // })
    // console.log(tasksList);

    // useEffect(() => {
    //     if (tasksLoading) {
    //         if (!firstTasksLoaded) {
    //             setFirstTasksLoaded(true);
    //         }
    //     }
    // }, [tasksLoading]);

    const {
        isLoading: toysLoading,
        error: toysError,
        data: toysList,
    } = useQuery(["toys"], fetchToys);
    const {
        isLoading: tagsLoading,
        error: tagsError,
        data: tagsList,
    } = useQuery(["tags"], fetchTags);
    const {
        isLoading: categoriesLoading,
        error: categoriesError,
        data: categoriesList,
    } = useQuery(["categories"], fetchCategories);

    // из queryParams в контролы
    useEffect(() => {
        if (search?.length) {
            setSearchQuery(search);
        }
        if (category) {
            setCategoryFilter(Number(category));
        }
        if (toys?.length) {
            setToysFilter(toys.map(toyId => Number(toyId)));
        }
        if (tags?.length) {
            setTagsFilter(tags.map(tagId => Number(tagId)));
        }
    }, [search, category, toys, tags]);

    const toysItems = useMemo(() => {
        if (toysList) {
            return toysList.map((toy: Toy) => {
                return {value: toy.id, label: toy.title};
            })
        }
        return [];
    }, [toysList]);
    const categoriesItems = useMemo(() => {
        if (categoriesList) {
            return categoriesList.map((category: Category) => {
                return {value: category.id, label: category.title};
            })
        }
        return [];
    }, [categoriesList]);
    const tagsItems = useMemo(() => {
        if (tagsList) {
            return tagsList.map((tag: Tag) => {
                return {value: tag.id, label: JSON.parse(tag.name).ru};
            })
        }
        return [];
    }, [tagsList]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const debouncedSearchQuery = useDebounce<string>(searchQuery, 500)

    const [toysFilter, setToysFilter] = useState<any[]>();
    const [tagsFilter, setTagsFilter] = useState<any[]>();
    const [categoryFilter, setCategoryFilter] = useState<any>();

    // из контролов в queryParams
    useEffect(() => {
        const qsParams: any = {};
        qsParams.search = debouncedSearchQuery ? debouncedSearchQuery : null;
        qsParams.toys = toysFilter ? toysFilter : null;
        qsParams.category = categoryFilter ? categoryFilter : null;
        qsParams.tags = tagsFilter ? tagsFilter : null;
        setQuery(qsParams);
    }, [debouncedSearchQuery, toysFilter, categoryFilter, tagsFilter]);

    function onSearchQueryChange(e: ChangeEvent<HTMLInputElement>) {
        setSearchQuery(e.target.value)
    }

    function onToysFilterChange(selectedToys: string[]) {
        setToysFilter(selectedToys)
    }

    function onTagsFilterChange(selectedTags: string[]) {
        setTagsFilter(selectedTags)
    }

    function onCategoryFilterChange(selectedCategory: string) {
        setCategoryFilter(selectedCategory)
    }

    // const allRows = data ? data.pages.flatMap((d) => d.rows) : [];
    const setFavorite = (task: Task) => {
        if (task?.id) {
            updateIsFavorite.mutate(task.id.toString());
        }
    }
    const setLiked = (task: Task) => {
        if (task?.id) {
            updateIsLiked.mutate(task.id.toString());
        }
    }
    return (
        <>
            <Container>
                <Title order={1}>Все задания</Title>
                <div className="container mx-auto">
                    <Stack>
                        <Group dir='row' className="filters" grow>
                            <TextInput width={'100%'}
                                       icon={<IconSearch size={18} stroke={1.5}/>}
                                       placeholder="Поиск по названию или описанию"
                                       rightSectionWidth={42}
                                       value={searchQuery}
                                       onChange={onSearchQueryChange}
                            />
                            <Select value={categoryFilter}
                                    onChange={onCategoryFilterChange}
                                    data={categoriesItems}/>
                        </Group>
                        <Group dir='row' className="filters" grow>
                            <MultiSelect value={toysFilter}
                                         onChange={onToysFilterChange}
                                         data={toysItems}/>
                            <MultiSelect value={tagsFilter}
                                         onChange={onTagsFilterChange}
                                         data={tagsItems}/>
                        </Group>
                    </Stack>
                    <Space h="md"/>
                    {tasksList.length}
                    <div className="overflow-x-auto bg-white rounded shadow">
                        {status === 'loading' ? (
                            <p>Loading...</p>
                        ) : status === 'error' ? (
                            <span>Error: {(tasksError as Error).message}</span>
                        ) : (
                            tasksList.length ? <VirtuosoGrid
                                useWindowScroll
                                overscan={200}
                                data={tasksList}
                                listClassName={classes.gridList}
                                itemClassName={classes.gridItem}
                                endReached={loadMore}
                                itemContent={(index, task: Task) => {
                                    return <TaskCard
                                        task={tasksList[index]}
                                        setFavorite={setFavorite}
                                        setLike={setLiked}/>
                                }
                                }
                                // scrollSeekConfiguration={{
                                //     enter: velocity => Math.abs(velocity) > 200,
                                //     exit: velocity => Math.abs(velocity) < 30,
                                //     change: (_, range) => console.log({range}),
                                // }}
                            /> : null

                            // <div ref={parentRef}
                            //      className="List"
                            //      style={{
                            //          height: `500px`,
                            //          width: `100%`,
                            //          overflow: 'auto',
                            //      }}>
                            //     <SimpleGrid style={{
                            //         height: `${rowVirtualizer.getTotalSize()}px`,
                            //         width: '100%',
                            //         position: 'relative'
                            //     }} breakpoints={[
                            //         {minWidth: 480, cols: 1, spacing: 'sm'},
                            //         {minWidth: 768, cols: 2, spacing: 'sm'},
                            //         {minWidth: 1024, cols: 3, spacing: 'sm'},
                            //     ]}>
                            //         {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                            //             const isLoaderRow = virtualRow.index > tasksList.length - 1
                            //             const task = tasksList[virtualRow.index];
                            //             if (isLoaderRow) {
                            //                 return hasNextPage ? 'Loading more...' : 'Nothing more to load';
                            //             } else {
                            //                 const column = virtualRow.index % 3;
                            //                 const row = Math.floor(virtualRow.index / 3); // int col = index / mRowCount;
                            //                 console.log(virtualRow.index, "col: ", column, " row: ", row);
                            //                 return <TaskCard
                            //                         key={virtualRow.index}
                            //                         task={task}
                            //                         setFavorite={setFavorite}
                            //                         setLike={setLiked}/>
                            //             }
                            //         })
                            //         }
                            //     </SimpleGrid>
                            // </div>
                        )}
                        {/*{tasksLoading ? <Center mt={48}><Loader size={150}/></Center> :*/}
                        {/*    <SimpleGrid breakpoints={[*/}
                        {/*        {minWidth: 480, cols: 1, spacing: 'sm'},*/}
                        {/*        {minWidth: 768, cols: 2, spacing: 'sm'},*/}
                        {/*        {minWidth: 1024, cols: 3, spacing: 'sm'},*/}
                        {/*    ]}>*/}
                        {/*        {tasksList?.length ? tasksList.map((task: Task) => (*/}
                        {/*            <TaskCard key={task.id} task={task} setFavorite={setFavorite} setLike={setLiked}/>*/}
                        {/*        )) : <div>Ничего не найдено.</div>}*/}
                        {/*    </SimpleGrid>}*/}

                    </div>
                </div>
                {/*</Flipper>*/}
            </Container>

            <Affix position={{bottom: 40, right: 20}}>
                <Button
                    component='a'
                    href={'tasks/add'}
                    leftIcon={<IconCirclePlus size={16}/>}
                >
                    Добавить задание
                </Button>
            </Affix>
        </>
    );
};

export default ListTasksInfinite;
