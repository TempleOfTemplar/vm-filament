import React, {ChangeEvent, useEffect, useState} from 'react';
import {InertiaLink, usePage} from "@inertiajs/inertia-react";
import {Inertia} from "@inertiajs/inertia";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import TaskCard from "../../Components/TaskCard";
import {Affix, Container, Group, MultiSelect, Select, SimpleGrid, Stack, TextInput, Button} from "@mantine/core";
import {IconCirclePlus, IconSearch} from "@tabler/icons";
import useDebounce from "../../Hooks/useDebounce";


//href={route("tasks.edit", id)}
const ListTasks = () => {
    const {tasks, toys, categories, tags} = usePage().props as any;
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

    useEffect(() => {
        const queryParamsData: any = {};
        if (searchQuery?.length) {
            queryParamsData.search = searchQuery;
        }
        if (toysFilter?.length) {
            queryParamsData.toys = toysFilter;
        }
        if (tagsFilter?.length) {
            queryParamsData.tags = tagsFilter;
        }
        if (categoryFilter) {
            queryParamsData.category = categoryFilter;
        }
        Inertia.get(
            route(route().current()),
            queryParamsData,
            {
                preserveState: true,
                replace: true,
            }
        );
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


    return (
        <>
            <Container>
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
                    <div className="overflow-x-auto bg-white rounded shadow">
                        <SimpleGrid cols={3}>
                            {tasks ? tasks.map((task) => (
                                <TaskCard key={task.id} task={task}/>
                            )) : null}
                            {tasks.length === 0 && (
                                <div>Ничего не найдено.</div>
                            )}
                        </SimpleGrid>

                    </div>
                </div>
            </Container>

            <Affix position={{bottom: 40, right: 20}}>
                <Button
                    component='a'
                    href={route("tasks.create")}
                    leftIcon={<IconCirclePlus size={16}/>}
                >
                    Добавить задание
                </Button>
            </Affix>
        </>
    );
};

export default ListTasks;
