import React, {ChangeEvent, useEffect, useState} from 'react';
import {usePage} from "@inertiajs/inertia-react";
import {Inertia} from "@inertiajs/inertia";
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


//href={route("tasks.edit", id)}
const ListTasks = () => {
    const page = usePage().props as any;
    console.log("page", page);
    const {tasks, toys, categories, tags} = page;
    const [tasksList, setTasksList] = useState<Task[]>(tasks);
    console.log("TASKS", tasks);
    const toysItems = toys ? toys.map(toy => {
        return {value: toy.id, label: toy.title};
    }) : [];
    const categoriesItems = categories ? categories.map(category => {
        return {value: category.id, label: category.title};
    }) : [];
    const tagsItems = tags ? tags.map(tag => {
        return {value: tag.id, label: tag.name.ru};
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

    useEffect(() => {
        // const queryParamsData: any = {};
        // if (searchQuery?.length) {
        //     queryParamsData.search = searchQuery;
        // }
        // if (toysFilter?.length) {
        //     queryParamsData.toys = toysFilter;
        // }
        // if (tagsFilter?.length) {
        //     queryParamsData.tags = tagsFilter;
        // }
        // if (categoryFilter) {
        //     queryParamsData.category = categoryFilter;
        // }
        // Inertia.get(
        //     route(route().current()),
        //     queryParamsData,
        //     {
        //         preserveState: true,
        //         replace: true,
        //     }
        // );
        console.log("tagsFilter", tagsFilter);
        const sortedTasks = tagsFilter ? shuffle(tasksList) : tasksList;
        console.log("sortedTasks", sortedTasks);
        setTasksList(sortedTasks);
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
        Inertia.patch(route('tasks.setFavorite', task.id), {to: true});
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
                            <Select onChange={onCategoryFilterChange} data={categoriesItems}/>
                        </Group>
                        <Group dir='row' className="filters" grow>
                            <MultiSelect onChange={onToysFilterChange} data={toysItems}/>
                            <MultiSelect onChange={onTagsFilterChange} data={tagsItems}/>
                        </Group>
                    </Stack>
                    <Space h="md"/>
                    <div className="overflow-x-auto bg-white rounded shadow">
                        <SimpleGrid cols={3}>
                                    {tasksList ? tasksList.map((task: Task) => (
                                        <Flipped flipId={task.id}  key={task.id}><TaskCard task={task} setFavorite={setFavorite}/></Flipped>
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
                    href={route("tasks.add")}
                    leftIcon={<IconCirclePlus size={16}/>}
                >
                    Добавить задание
                </Button>
            </Affix>
        </Flipper>
    );
};
export default ListTasks;
