import React, {ChangeEvent, useEffect, useMemo, useRef, useState} from 'react';
import {
    Affix,
    Button,
    Container,
    Group,
    MultiSelect,
    Select,
    SimpleGrid,
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
import {useVirtualizer} from "@tanstack/react-virtual";


//href={route("tasks.edit", id)}
const ListTasksInfinite = () => {
    const {ref, inView} = useInView()
    const parentRef = useRef<any>()
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
    const tasksList = (tasksPaginationData as any)?.pages ? (tasksPaginationData as any).pages[0].data : [];
    const rowVirtualizer = useVirtualizer({
        count: hasNextPage ? tasksList.length + 1 : tasksList.length,
        getScrollElement: () => parentRef?.current,
        estimateSize: () => 467,
        horizontal: false,
        overscan: 6,
    })
    console.log(tasksList);

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
                    <div className="overflow-x-auto bg-white rounded shadow">

                        {/*                        {status === 'loading' ? (
                            <p>Loading...</p>
                        ) : status === 'error' ? (
                            <span>Error: {(error as Error).message}</span>
                        ) : (
                            <div
                                ref={parentRef}
                                className="List"
                                style={{
                                    height: `500px`,
                                    width: `100%`,
                                    overflow: 'auto',
                                }}
                            >
                                <div
                                    style={{
                                        height: `${rowVirtualizer.getTotalSize()}px`,
                                        width: '100%',
                                        position: 'relative',
                                    }}
                                >
                                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                        const isLoaderRow = virtualRow.index > allRows.length - 1
                                        const post = allRows[virtualRow.index]

                                        return (
                                            <div
                                                key={virtualRow.index}
                                                className={
                                                    virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'
                                                }
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: `${virtualRow.size}px`,
                                                    transform: `translateY(${virtualRow.start}px)`,
                                                }}
                                            >
                                                {isLoaderRow
                                                    ? hasNextPage
                                                        ? 'Loading more...'
                                                        : 'Nothing more to load'
                                                    : post}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )};
                        <div>
                            {isFetching && !isFetchingNextPage ? 'Background Updating...' : null}
                        </div>*/}
                        {status === 'loading' ? (
                            <p>Loading...</p>
                        ) : status === 'error' ? (
                            <span>Error: {(tasksError as Error).message}</span>
                        ) : (
                            <div ref={parentRef}
                                 className="List"
                                 style={{
                                     height: `500px`,
                                     width: `100%`,
                                     overflow: 'auto',
                                 }}>
                                <SimpleGrid style={{
                                    height: `${rowVirtualizer.getTotalSize()}px`,
                                    width: '100%',
                                    position: 'relative'
                                }} breakpoints={[
                                    {minWidth: 480, cols: 1, spacing: 'sm'},
                                    {minWidth: 768, cols: 2, spacing: 'sm'},
                                    {minWidth: 1024, cols: 3, spacing: 'sm'},
                                ]}>
                                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                        const isLoaderRow = virtualRow.index > tasksList.length - 1
                                        const task = tasksList[virtualRow.index];
                                        if (isLoaderRow) {
                                            return hasNextPage ? 'Loading more...' : 'Nothing more to load';
                                        } else {
                                            const column = virtualRow.index % 3;
                                            const row = Math.floor(virtualRow.index / 3); // int col = index / mRowCount;
                                            console.log(virtualRow.index, "col: ", column, " row: ", row);
                                            return <div key={virtualRow.index}
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: `calc((100% / 3) * ${(virtualRow.index % 3)})`,
                                                            width: 'calc(100% / 3)',
                                                            height: `${virtualRow.size}px`,
                                                            transform: `translateY(${row * virtualRow.size}px)`
                                                        }}>
                                                <TaskCard

                                                    task={task}
                                                    setFavorite={setFavorite}
                                                    setLike={setLiked}/>
                                            </div>
                                        }
                                    })
                                    }
                                </SimpleGrid>
                            </div>
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
