import React, {ChangeEvent, useEffect, useState} from 'react';
import TaskCard from "../../Components/TaskCard";
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
import {Task} from "../../Models/Task";
import {Flipped, Flipper} from "react-flip-toolkit";
import {Tag} from "../../Models/Tag";
import {Toy} from "../../Models/Toy";
import {Category} from "../../Models/Category";
import api from "../../utils/Api";
import {useSearchParams} from "react-router-dom";
import {ArrayParam, StringParam, useQueryParams} from "use-query-params";


//href={route("tasks.edit", id)}
const ListTasks = () => {
    const [tasksList, setTasksList] = useState<Task[]>([]);
    const [toysList, setToys] = React.useState([]);
    const [categoriesList, setCategoriesList] = React.useState([]);
    const [tagsList, setTagsList] = React.useState([]);

    let [searchParams, setSearchParams] = useSearchParams();

    const [query, setQuery] = useQueryParams({
        search: StringParam,
        category: StringParam,
        toys: ArrayParam,
        tags: ArrayParam,
    });
    const {search, category, toys, tags} = query;
    useEffect(() => {
        api().get("/api/tasks")
            .then((res) => {
                setTasksList(res.data.data);
            })
            .catch((err) => {
            });

        api().get("/api/toys")
            .then((res) => {
                setToys(res.data.data);
            })
            .catch((err) => {
            });

        api().get("/api/tags")
            .then((res) => {
                setTagsList(res.data.data);
            })
            .catch((err) => {
            });
        api().get("/api/categories")
            .then((res) => {
                setCategoriesList(res.data.data);
            })
            .catch((err) => {
            });
    }, []);

    // из queryParams в контролы
    useEffect(() => {
        const queryParamsData: any = {};

        if (search?.length) {
            setSearchQuery(search);
            queryParamsData.search = search;
        }
        if (category) {
            setCategoryFilter(Number(category));
            queryParamsData.category = category;
        }
        if (toys?.length) {
            setToysFilter(toys.map(toyId => Number(toyId)));
            queryParamsData.toys = toys;
        }
        if (tags?.length) {
            setTagsFilter(tags.map(tagId => Number(tagId)));
            queryParamsData.tags = tags;
        }
        console.log("queryParamsData", queryParamsData);
        api().get("/api/tasks", {params: queryParamsData})
            .then((res) => {
                setTasksList(res.data.data);
            })
            .catch((err) => {
            });
    }, [search, category, toys, tags]);


    const toysItems = toysList ? toysList.map((toy: Toy) => {
        return {value: toy.id, label: toy.title};
    }) : [];
    const categoriesItems = categoriesList ? categoriesList.map((category: Category) => {
        return {value: category.id, label: category.title};
    }) : [];
    const tagsItems = tagsList ? tagsList.map((tag: Tag) => {
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
        // Inertia.patch(route('tasks.setFavorite', task.id), {to: true});
    }

    return (
        <Flipper
            flipKey={tasksList?.map((tag) => tag.id).join("_")}
        >
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
                            <Select value={categoryFilter} onChange={onCategoryFilterChange} data={categoriesItems}/>
                        </Group>
                        <Group dir='row' className="filters" grow>
                            <MultiSelect value={toysFilter} onChange={onToysFilterChange} data={toysItems}/>
                            <MultiSelect value={tagsFilter} onChange={onTagsFilterChange} data={tagsItems}/>
                        </Group>
                    </Stack>
                    <Space h="md"/>
                    <div className="overflow-x-auto bg-white rounded shadow">
                        <SimpleGrid cols={3}>
                            {tasksList ? tasksList.map((task: Task) => (
                                <Flipped flipId={task.id} key={task.id}><TaskCard task={task}
                                                                                  setFavorite={setFavorite}/></Flipped>
                            )) : null}
                            {tasksList.length === 0 && (
                                <div>Ничего не найдено.</div>
                            )}
                        </SimpleGrid>

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
        </Flipper>
    );
};
export default ListTasks;
