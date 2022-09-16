import React, {ChangeEvent, useEffect, useState} from 'react';
import {InertiaLink, usePage} from "@inertiajs/inertia-react";
import {Inertia} from "@inertiajs/inertia";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import TaskCard from "../../Components/TaskCard";
import {Group, MultiSelect, Select, SimpleGrid, TextInput} from "@mantine/core";
import {IconSearch} from "@tabler/icons";
import useDebounce from "../../Hooks/useDebounce";


//href={route("tasks.edit", id)}
const ListTasks = () => {
    const {tasks, toys, categories, tags, auth} = usePage().props as any;
    const toysItems = toys.map(toy => {
        return {value: toy.id, label: toy.title};
    })
    const categoriesItems = categories.map(category => {
        return {value: category.id, label: category.title};
    })
    const tagsItems = tags.map(tag => {
        return {value: tag.id, label: tag.name.ru};
    })
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
        <AuthenticatedLayout
            auth={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <div>
                <div className="container mx-auto">
                    <h1 className="mb-8 text-3xl font-bold text-center">Post</h1>
                    <Group dir='row' className="filters">
                        <TextInput
                            icon={<IconSearch size={18} stroke={1.5}/>}
                            placeholder="Search tasks"
                            rightSectionWidth={42}
                            value={searchQuery}
                            onChange={onSearchQueryChange}
                        />
                        <MultiSelect onChange={onToysFilterChange} data={toysItems}/>
                        <MultiSelect onChange={onTagsFilterChange} data={tagsItems}/>
                        <Select onChange={onCategoryFilterChange} data={categoriesItems}/>
                        {/*<Select options={toysItems} isMulti={true} onChange={onToysFilterChange}/>*/}
                        {/*<Select options={tagsItems} isMulti={true} onChange={onTagsFilterChange}/>*/}
                        {/*<Select options={categoriesItems} isMulti={false} onChange={onCategoryFilterChange}/>*/}
                    </Group>


                    <div className="flex items-center justify-between mb-6">
                        <InertiaLink
                            className="px-6 py-2 text-white bg-green-500 rounded-md focus:outline-none"
                            href={route("tasks.create")}
                        >
                            Create Post
                        </InertiaLink>
                    </div>

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
            </div>
        </AuthenticatedLayout>
    );
};

export default ListTasks;
