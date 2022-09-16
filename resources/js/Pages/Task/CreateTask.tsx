import React, {useState} from 'react';
import {InertiaLink, useForm, usePage} from "@inertiajs/inertia-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Select from "react-select";

const CreateTask = () => {
    const {toys, categories} = usePage().props as any;
    const {data, setData, errors, post} = useForm();
    const [selectedToys, setSelectedToys] = useState();
    const [selectedCategories, setSelectedCategories] = useState();

    const toysItems = toys.map(toy => {
        return {value: toy.id, label: toy.title}
    })
    const categoriesItems = categories.map(category => {
        return {value: category.id, label: category.title}
    })

    function handleSubmit(e) {
        e.preventDefault();
        post(route("tasks.store"));
    }

    function handleToysChange(selectedToys) {
        // setData("toys", selectedToys)
        setSelectedToys(selectedToys);
        setData("toys", selectedToys.map(toy => toy.value))
    }

    function handleCategoriesChange(selectedCategories) {
        setData("categories", selectedCategories.map(category => category.value));
        setSelectedCategories(selectedToys);
    }

    return (
        <div className="mt-20">
            <div className="container flex flex-col justify-center mx-auto">
                <div>
                    <h1 className="mb-8 text-3xl font-bold">
                        <InertiaLink
                            href={route("tasks.index")}
                            className="text-indigo-600 hover:text-indigo-700"
                        >
                            tasks
                        </InertiaLink>
                        <span className="font-medium text-indigo-600"> / </span>
                        Create
                    </h1>
                </div>
                <div className="max-w-6xl p-8 bg-white rounded shadow">
                    <form name="createForm" onSubmit={handleSubmit}>
                        <div className="flex flex-col">
                            <div className="mb-4">
                                <label className="">Title</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2"
                                    label="Title"
                                    name="title"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                />
                                <span className="text-red-600">
                                    {errors.title}
                                </span>
                            </div>
                            <div className="mb-4">
                                <label className="">Description</label>
                                <textarea
                                    type="text"
                                    className="w-full rounded"
                                    label="excerpt"
                                    name="excerpt"
                                    errors={errors.excerpt}
                                    value={data.excerpt}
                                    onChange={(e) =>
                                        setData("excerpt", e.target.value)
                                    }
                                />
                                <span className="text-red-600">
                                    {errors.excerpt}
                                </span>
                            </div>
                            <div className="mb-4">
                                <label className="">Toys</label>
                                <Select options={toysItems} value={selectedToys} isMulti={true}
                                        onChange={handleToysChange}/>
                                <span className="text-red-600">
                                    {errors.toys}
                                </span>
                            </div>
                            <div className="mb-4">
                                <label className="">Categories</label>
                                <Select options={categoriesItems} value={selectedCategories} isMulti={true}
                                        onChange={handleCategoriesChange}/>
                                <span className="text-red-600">
                                    {errors.categories}
                                </span>
                            </div>
                            <div className="mb-0">
                                <label className="">content</label>
                                <ReactQuill theme="snow"
                                            value={data.content}
                                            onChange={(e) =>
                                                setData("content", e)
                                            }/>
                                <span className="text-red-600">
                                    {errors.content}
                                </span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <button
                                type="submit"
                                className="px-6 py-2 font-bold text-white bg-green-500 rounded"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateTask;
