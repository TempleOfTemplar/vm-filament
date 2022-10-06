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
import {ArrayParam, StringParam, useQueryParams, withDefault} from "use-query-params";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {fetchTasks, setTaskFavorite} from "@/services/TasksService";
import {fetchToys} from "@/services/ToysService";
import {fetchTags} from "@/services/TagsService";
import {fetchCategories} from "@/services/CategoriesService";
import {useSearchParams} from "react-router-dom";
import {useUpdateIsFavorite} from "@/queries/useSetTaskFavorite";


//href={route("tasks.edit", id)}
const ListTasks = () => {
    const [query, setQuery] = useQueryParams({
        search: StringParam,
        category: StringParam,
        toys: ArrayParam,
        tags: ArrayParam,
    }, {});
    const updateIsFavorite = useUpdateIsFavorite(query);


    const [firstTasksLoaded, setFirstTasksLoaded] = useState<boolean>(false);

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


    const setFavorite = (task: Task) => {
        if (task?.id) {
            updateIsFavorite.mutate(task.id.toString());
        }
    }
    return (
        <>
            <Container>
                <Title order={1}>Все задания</Title>
                <div className="container mx-auto">
                    <Stack>
                        <Group dir='row' className="filters" grow >
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
                        {!firstTasksLoaded && tasksLoading ? <Center mt={48}><Loader size={150}/></Center> :
                            <SimpleGrid breakpoints={[
                                {minWidth: 480, cols: 1, spacing: 'sm'},
                                {minWidth: 768, cols: 2, spacing: 'sm'},
                                {minWidth: 1024, cols: 3, spacing: 'sm'},
                            ]}>
                                {tasksList?.length ? tasksList.map((task: Task) => (
                                    <TaskCard key={task.id} task={task} setFavorite={setFavorite}/>
                                )) : <div>Ничего не найдено.</div>}
                            </SimpleGrid>}

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
