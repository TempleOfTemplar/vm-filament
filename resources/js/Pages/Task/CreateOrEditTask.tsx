import React, {useEffect, useMemo, useState} from 'react';
import {createReactEditorJS} from "react-editor-js";
import {Button, Container, Group, Input, MultiSelect, Select, Textarea, TextInput} from "@mantine/core";
import {EDITOR_JS_TOOLS} from "../../utils/EditorJsToolbar";
import {Tag} from "../../Models/Tag";
import {Toy} from "../../Models/Toy";
import {Category} from "../../Models/Category";
import {useForm} from "@mantine/form";
import api from "../../utils/Api";
import {useParams} from "react-router-dom";
import {useGetApiToysQuery} from "@/store/reducers/ToysSlice";
import {useGetApiCategoriesQuery} from "@/store/reducers/CategoriesSlice";
import {useGetApiTagsQuery} from "@/store/reducers/TagsSlice";
import {useGetApiTasksByTaskQuery, useGetApiTasksQuery} from "@/store/reducers/TasksSlice";

const ReactEditorJS = createReactEditorJS()


const CreateOrEditTask = () => {
    let {taskId} = useParams();
    const editMode = useMemo(() => {
        return !!taskId;
    }, [taskId]);
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

    const editorCore = React.useRef(null);




    const {
        isLoading: toysLoading,
        error: toysError,
        data: toysList
    } = useGetApiToysQuery();
    const {
        isLoading: categoriesLoading,
        error: categoriesError,
        data: categoriesList
    } = useGetApiCategoriesQuery();
    const {
        isLoading: tagsLoading,
        error: tagsError,
        data: tagsList
    } = useGetApiTagsQuery();

    useEffect(() => {
        if (editMode) {
            const {
                isLoading: taskLoading,
                error: taskError,
                data: task
            } = useGetApiTasksByTaskQuery(taskId);
            api().get(`/api/tasks/${taskId}`)
                .then((res) => {
                    const formData = res.data.data;
                    form.setValues({
                        title: formData.title,
                        excerpt: formData.excerpt,
                        category: formData.category.id,
                        tags: formData.tags ? formData.tags.map((tag: Tag) => tag.id) : [],
                        toys: formData.toys ? formData.toys.map((toy: Toy) => toy.id) : [],
                        content: JSON.parse(formData.content)
                    });
                })
                .catch((err) => {
                });
        }
    }, []);


    const toysItems = useMemo(() => {
        return toysList ? toysList.map((toy: Toy) => {
            return {value: toy.id, label: toy.title}
        }) : [];
    }, [toysList]);

    const tagsItems = useMemo(() => {
        return tagsList ? tagsList.map((tag: Tag) => {
            return {value: tag.id, label: JSON.parse(tag.name).ru}
        }) : [];
    }, [tagsList]);

    const categoriesItems = useMemo(() => {
        return categoriesList ? categoriesList.map((category: Category) => {
            return {value: category.id, label: category.title}
        }) : [];
    }, [categoriesList]);


    function handleSubmit(e: any) {
        e.preventDefault();
        console.log("form", form.values);
        if (editMode) {

        } else {

        }
    }

    function handleInitialize(instance: any) {
        editorCore.current = instance
    }

    async function handleSave() {
        const savedData = await editorCore.current.save();
        form.setFieldValue('content', savedData);
    }

    return (
        <Container>
            <div>
            </div>
            <form name="createForm" onSubmit={handleSubmit}>
                <TextInput name="title"
                           label="Заголовок"
                           withAsterisk
                           {...form.getInputProps('title')}/>
                {/*{errors.title}*/}
                <Textarea
                    name="excerpt"
                    placeholder=""
                    label="Краткое описание"
                    withAsterisk
                    {...form.getInputProps('excerpt')}
                />
                {/*{errors.excerpt}*/}
                <MultiSelect name="toys"
                             label={"Инвентарь"}
                             data={toysItems}
                             {...form.getInputProps('toys')}
                    // value={selectedToys}
                    // onChange={handleToysChange}
                />
                {/*{errors.toys}*/}
                <MultiSelect name="tags"
                             label={"Теги"}
                             data={tagsItems}
                             {...form.getInputProps('tags')}
                    // value={selectedTags}
                    // onChange={handleTagsChange}
                />
                {/*{errors.tags}*/}
                <Select name="category"
                        label={"Категория"}
                        data={categoriesItems}
                        {...form.getInputProps('category')}
                    // value={selectedCategory}
                    // onChange={handleCategoryChange}
                />
                {/*{errors.category}*/}
                <Input.Wrapper label="Текст задания">
                    <ReactEditorJS
                        value={form.values.content}
                        onInitialize={handleInitialize}
                        tools={EDITOR_JS_TOOLS}
                        onChange={handleSave}/>
                </Input.Wrapper>
                {/*{errors.content}*/}
                <Group position="right" mt="md">
                    <Button type={"submit"}>{editMode ? 'Сохранить' : 'Отправить на модерацию'}</Button>
                </Group>
            </form>
        </Container>
    );
};

export default CreateOrEditTask;
