import React, {ChangeEvent, useEffect, useState} from 'react';
import {InertiaLink, usePage} from "@inertiajs/inertia-react";
import {Inertia} from "@inertiajs/inertia";
import Select from "react-select";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import TaskCard from "../../Components/TaskCard";
import {SimpleGrid} from "@mantine/core";


//href={route("tasks.edit", id)}
const ListTasks = () => {
    const {tasks, toys, categories, auth} = usePage().props as any;
    console.log("AUTH", auth);
    const toysItems = toys.map(toy => {
        return {value: toy.id, label: toy.title};
    })
    const [searchQuery, setSearchQuery] = useState<string>();
    const [toysFilter, setToysFilter] = useState<[]>();
    const [categoriesFilter, setCategoriesFilter] = useState<[]>();
    const promiseOptions = (inputValue: string) => {
        // Inertia.get(route("toy.list", task.id));
    };

    useEffect(() => {
        Inertia.get(
            route(route().current()),
            {search: searchQuery, toys: toysFilter},
            {
                preserveState: true,
                replace: true,
            }
        );
    }, [searchQuery, toysFilter]);

    function onSearchQueryChange(e: ChangeEvent<HTMLInputElement>) {
        setSearchQuery(e.target.value)
    }

    function onToysFilterChange(selectedToys: any) {
        const selectedValues = selectedToys.map(selectedToy => selectedToy.value);
        setToysFilter(selectedValues)
    }

    return (
        <AuthenticatedLayout
            auth={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <div>
                <div className="container mx-auto">
                    <h1 className="mb-8 text-3xl font-bold text-center">Post</h1>
                    <div className="filters">
                        <input value={searchQuery} onChange={onSearchQueryChange}/>
                        <Select options={toysItems} isMulti={true} onChange={onToysFilterChange}/>
                    </div>


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
