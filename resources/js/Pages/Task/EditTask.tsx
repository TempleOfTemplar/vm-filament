import React, {useEffect} from 'react';
import {InertiaLink, useForm, usePage} from "@inertiajs/inertia-react";
import {Inertia} from "@inertiajs/inertia";
import {createReactEditorJS} from 'react-editor-js'
import {EDITOR_JS_TOOLS} from '../../utils/EditorJsToolbar'
import 'react-quill/dist/quill.snow.css';

const ReactEditorJS = createReactEditorJS()

const EditTask = () => {
    const {task} = usePage().props as any;
    const {data, setData, put, errors} = useForm();

    useEffect(() => {
        setData(task);
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        put(route("tasks.update", task.id));
    }

    function destroy() {
        if (confirm("Are you sure you want to delete this user?")) {
            Inertia.delete(route("tasks.destroy", task.id));
        }
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
                        <span className="font-medium text-indigo-600"> /</span>
                        Edit
                    </h1>
                </div>
                <div className="max-w-3xl p-8 bg-white rounded shadow">
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
                                <label className="">excerpt</label>
                                <textarea
                                    type="text"
                                    className="w-full rounded"
                                    label="Excerpt"
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
                                <label className="">content</label>
                                <ReactEditorJS defaultValue={data.content}
                                               tools={EDITOR_JS_TOOLS}
                                               onChange={(e) =>
                                                   setData("content", e)
                                               }/>
                                <span className="text-red-600">
                                    {errors.content}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <button
                                type="submit"
                                className="px-4 py-2 text-white bg-green-500 rounded"
                            >
                                Update
                            </button>
                            <button
                                onClick={destroy}
                                tabIndex="-1"
                                type="button"
                                className="px-4 py-2 text-white bg-red-500 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditTask;
