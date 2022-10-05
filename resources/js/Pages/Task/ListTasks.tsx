import React, {ChangeEvent, useEffect, useMemo, useState} from 'react';
import TaskCard from "../../Components/TaskCard";
import {
    Affix,
    Button,
    Center,
    Container,
    Group,
    Loader,
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
import {Task} from "../../Models/Task";
import {Tag} from "../../Models/Tag";
import {Toy} from "../../Models/Toy";
import {Category} from "../../Models/Category";
import {ArrayParam, StringParam, useQueryParams} from "use-query-params";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {fetchTasks, setTaskFavorite} from "@/services/TasksService";
import {fetchToys} from "@/services/ToysService";
import {fetchTags} from "@/services/TagsService";
import {fetchCategories} from "@/services/CategoriesService";


//href={route("tasks.edit", id)}
const ListTasks = () => {
    const [query, setQuery] = useQueryParams({
        search: StringParam,
        category: StringParam,
        toys: ArrayParam,
        tags: ArrayParam,
    });
    const queryClient = useQueryClient()
    const [firstTasksLoaded, setFirstTasksLoaded] = useState<boolean>(false);


    const useUpdateIsFavorite = useMutation(
        setTaskFavorite,
        {
            // When mutate is called:
            onMutate: async (taskId: string) => {
                await queryClient.cancelQueries(['tasks']);
                const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
                if (previousTasks) {
                    const taskToUpdateIndex = previousTasks.findIndex(task => task.id.toString() === taskId);
                    const tasksToUpdate = JSON.parse(JSON.stringify(previousTasks));
                    tasksToUpdate[taskToUpdateIndex].has_favorited = !tasksToUpdate[taskToUpdateIndex].has_favorited;
                    queryClient.setQueryData<Task[]>(['tasks'], [
                        ...tasksToUpdate,
                    ])
                }
                return previousTasks ? {previousTasks} : {previousTasks: []};
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err, variables, context) => {
                if (context) {
                    queryClient.setQueryData<Task[]>(['tasks'], [...context.previousTasks])
                }
            },
            // Always refetch after error or success:
            onSettled: () => {
                // queryClient.cancelQueries(['tasks'])
                // queryClient.invalidateQueries(['todos'])
            },
        },
    )

    // const useUpdateIsFavorite = (id: string) => {
    //     return useMutation(
    //         () => api().patch(`/api/tasks/favorite/${id}`, {}),
    //         {
    //             // 💡 response of the mutation is passed to onSuccess
    //             onSuccess: (updatedTask) => {
    //                 // ✅ update detail view directly
    //                 //queryClient.setQueryData(['tasks', id], updatedTask)
    //             },
    //             onMutate: async newTodo => {
    //                 console.log("newTodo", newTodo);
    //                 // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
    //                 await queryClient.cancelQueries(['tasks'])
    //
    //                 // Snapshot the previous value
    //                 const previousTodos = queryClient.getQueryData(['tasks'])
    //
    //                 // Optimistically update to the new value
    //                 queryClient.setQueryData(['tasks'], old => [...old, newTodo])
    //
    //                 // Return a context object with the snapshotted value
    //                 return {previousTodos}
    //             },
    //         }
    //     )
    // }

    // const {mutate: editTaskMutation, isLoading: isTaskEditing} = useMutation(async () => {
    //     return await api().patch(`api/tasks/${putId}`, {});
    // }, {
    //     onSuccess: (data, variables) => {
    //         console.log()
    //         queryClient.setQueryData(['task', {id: 5}], data)
    //     }
    // })

    const {search, category, toys, tags} = query;
    const {
        isLoading: tasksLoading,
        error: tasksError,
        data: tasksList,
        isFetching: tasksFetching
    } = useQuery(["tasks", query], fetchTasks, {keepPreviousData: true});
    useEffect(() => {
        if (tasksLoading) {
            if (!firstTasksLoaded) {
                setFirstTasksLoaded(true);
            }
        }
    }, [tasksLoading]);

    const {
        isLoading: toysLoading,
        error: toysError,
        data: toysList,
    } = useQuery(["toysList"], fetchToys);
    const {
        isLoading: tagsLoading,
        error: tagsError,
        data: tagsList,
    } = useQuery(["tagsList"], fetchTags);
    const {
        isLoading: categoriesLoading,
        error: categoriesError,
        data: categoriesList,
    } = useQuery(["categoriesList"], fetchCategories);

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
        if (debouncedSearchQuery) {
            qsParams.search = debouncedSearchQuery;
        } else {
            qsParams.search = null;
        }
        if (toysFilter) {
            qsParams.toys = toysFilter;
        } else {
            qsParams.toys = null;
        }
        if (categoryFilter) {
            qsParams.category = categoryFilter;
        } else {
            qsParams.category = null;
        }
        if (tagsFilter) {
            qsParams.tags = tagsFilter;
        } else {
            qsParams.tags = null;
        }
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

    const setFavorite = (task: Task) => {
        // updateIsFavorite(task.id.toString());
        if (task?.id) {
            useUpdateIsFavorite.mutate(task.id.toString());
        }
        // Inertia.patch(route('tasks.setFavorite', task.id), {to: true});
    }
    // const [prevTasksState, setPrevTasksState] = useState<Task[]>([]);
    // const tasksToRender = useMemo(() => {
    //     if (tasksList) {
    //         setPrevTasksState(tasksList);
    //         return tasksList;
    //     }
    //     return prevTasksState;
    // }, [tasksList]);

    return (
        <>
            <Container>
                {/*<Flipper*/}
                {/*    flipKey={`${JSON.stringify(query)}`}*/}
                {/*    staggerConfig={{*/}
                {/*        default: {*/}
                {/*            speed: 0.8*/}
                {/*        },*/}
                {/*    }}*/}
                {/*>*/}
                <Title order={1}>Все задания</Title>
                <div className="container mx-auto">
                    <Stack>
                        <Group dir='row' className="filters" grow>
                            <TextInput
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
                        {!firstTasksLoaded && tasksLoading ? <Center mt={48}><Loader size={150}/></Center> : null}
                        <SimpleGrid cols={3}>
                            {tasksList?.length ? tasksList.map((task: Task) => (
                                <TaskCard key={task.id} task={task} setFavorite={setFavorite}/>
                            )) : <div>Ничего не найдено.</div>}
                        </SimpleGrid>
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
export default ListTasks;
