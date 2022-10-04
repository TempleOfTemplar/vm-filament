import React, {ChangeEvent, useEffect, useState} from 'react';
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
import {useSetTaskFavoriteMutation} from "@/store/reducers/TasksSlice";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {editTask, fetchTasks} from "@/services/TasksService";
import {fetchToys} from "@/services/ToysService";
import {fetchTags} from "@/services/TagsService";
import {fetchCategories} from "@/services/CategoriesService";

//href={route("tasks.edit", id)}
const ListTasks = () => {
    const queryClient = useQueryClient()
    const [query, setQuery] = useQueryParams({
        search: StringParam,
        category: StringParam,
        toys: ArrayParam,
        tags: ArrayParam,
    });
    const {mutate: editTaskMutation} = useMutation(editTask, {
        onSuccess: (data, variables) => {
            console.log()
            queryClient.setQueryData(['task', {id: 5}], data)
        }
    })

    const {search, category, toys, tags} = query;
    const {
        isLoading: tasksLoading,
        error: tasksError,
        data: tasksList,
        isFetching: tasksFetching
    } = useQuery(["tasksList"], fetchTasks);
    console.log("tasksList" ,tasksList);
    const {
        isLoading: toysLoading,
        error: toysError,
        data: toysList,
        isFetching: toysFetching
    } = useQuery(["toysList"], fetchToys);
    const {
        isLoading: tagsLoading,
        error: tagsError,
        data: tagsList,
        isFetching: tagsFetching
    } = useQuery(["tagsList"], fetchTags);
    const {
        isLoading: categoriesLoading,
        error: categoriesError,
        data: categoriesList,
        isFetching: categoriesFetching
    } = useQuery(["categoriesList"], fetchCategories);

    // const {
    //     isLoading: tasksLoading,
    //     isFetching: tasksFetching,
    //     error: tasksError,
    //     data: tasksList
    // } = useGetApiTasksQuery({
    //     search,
    //     category,
    //     toys,
    //     tags
    // });
    // const {
    //     isLoading: toysLoading,
    //     error: toysError,
    //     data: toysList
    // } = useGetApiToysQuery();
    // const {
    //     isLoading: categoriesLoading,
    //     error: categoriesError,
    //     data: categoriesList
    // } = useGetApiCategoriesQuery();
    // const {
    //     isLoading: tagsLoading,
    //     error: tagsError,
    //     data: tagsList
    // } = useGetApiTagsQuery();

    // const [updateIsFavorite, {isLoading: isTaskFavoritedUpdating}] = useSetTaskFavoriteMutation();
    // const toysOptions = toysData && toysData.map(toy => ({label: toy.attributes.title, value: toy.id}));
    // const categoriesOptions = categoriesData && categoriesData.map(category => ({
    //     label: category.attributes.title,
    //     value: category.id
    // }));

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


    const toysItems = toysList?.length ? toysList.map((toy: Toy) => {
        return {value: toy.id, label: toy.title};
    }) : [];
    const categoriesItems = categoriesList?.length ? categoriesList.map((category: Category) => {
        return {value: category.id, label: category.title};
    }) : [];
    const tagsItems = tagsList?.length ? tagsList.map((tag: Tag) => {
        return {value: tag.id, label: JSON.parse(tag.name).ru};
    }) : [];
    const [searchQuery, setSearchQuery] = useState<string>("");
    const debouncedSearchQuery = useDebounce<string>(searchQuery, 500)

    const [toysFilter, setToysFilter] = useState<any[]>();
    const [tagsFilter, setTagsFilter] = useState<any[]>();
    const [categoryFilter, setCategoryFilter] = useState<any>();

    function shuffle(array: any[]) {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

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

    function setFavorite(task: Task) {
        updateIsFavorite(task.id.toString());
        // Inertia.patch(route('tasks.setFavorite', task.id), {to: true});
    }

    return (
        <>
            <Container>
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
                        {tasksFetching ? <Center mt={48}><Loader size={150}/></Center> :
                            <SimpleGrid cols={3}>
                                {tasksList ? tasksList.map((task: Task) => (
                                    <TaskCard key={task.id} task={task} setFavorite={setFavorite}/>
                                )) : null}
                                {tasksList?.length === 0 && (
                                    <div>Ничего не найдено.</div>
                                )}
                            </SimpleGrid>
                        }
                    </div>
                </div>
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
