import React, {useEffect} from 'react';
import {createReactEditorJS} from 'react-editor-js'
import {EDITOR_JS_TOOLS} from '../../utils/EditorJsToolbar'
import api from "../../utils/Api";
import {useParams} from "react-router-dom";
import {Container, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";

const ReactEditorJS = createReactEditorJS()

const EditTask = () => {
    let {taskId} = useParams();
    const editorCore = React.useRef(null)
    const form = useForm({
        initialValues: {
            title: '',
            excerpt: '',
            toys: [],
            tags: [],
            category: '',
            content: null
        },

        validate: {
            title: (value) => value.length > 0 ? null : "Пожалуйста введите пароль",
        },
    });

    useEffect(() => {

        api().get(`/api/tasks/${taskId}`)
            .then((res) => {
                const formData = res.data.data;
                console.log("FORM", formData);
                form.setValues({
                    title: formData.title,
                    excerpt: formData.excerpt,
                    content: JSON.parse(formData.content)
                });
                // setTasksList(res.data.data);
            })
            .catch((err) => {
            });
    }, []);

    function handleSubmit(e: any) {
        e.preventDefault();
        // put(route("tasks.update", task.id));
    }

    function destroy() {
        if (confirm("Are you sure you want to delete this user?")) {
            // Inertia.delete(route("tasks.destroy", task.id));
        }
    }

    async function handleSave() {
        const savedData = await editorCore.current.save();
        form.setFieldValue('content', savedData);
    }
    function handleInitialize(instance: any) {
        editorCore.current = instance
    }

    return (
        <Container>
            <form name="createForm" onSubmit={handleSubmit}>
                <TextInput
                    placeholder="Заголовок"
                    label="Заголовок"
                    withAsterisk
                    {...form.getInputProps('title')}
                />
                <TextInput
                    placeholder="Краткое описание"
                    label="Краткое описание"
                    withAsterisk
                    {...form.getInputProps('excerpt')}
                />
                <ReactEditorJS
                    tools={EDITOR_JS_TOOLS}
                    value={form.values.content}
                    onInitialize={handleInitialize}
                    onChange={handleSave}/>
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
        </Container>
    );
};

export default EditTask;
