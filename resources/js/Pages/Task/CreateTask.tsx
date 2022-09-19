import React, {useEffect, useState} from 'react';
import {useForm, usePage} from "@inertiajs/inertia-react";
import {createReactEditorJS} from "react-editor-js";
import {Button, Container, Group, Input, MultiSelect, Select, Textarea, TextInput} from "@mantine/core";
import {EDITOR_JS_TOOLS} from "../../utils/EditorJsToolbar";
import {Tag} from "../../Models/Tag";
import {Toy} from "../../Models/Toy";
import {Category} from "../../Models/Category";

console.log("FULL RE RENDER??");
debugger;
const ReactEditorJS = createReactEditorJS()


const CreateTask = () => {
    const {toys, tags, categories} = usePage().props as any;
    const {data, setData, errors, post} = useForm();
    const [selectedToys, setSelectedToys] = useState<string[]>();
    const [selectedTags, setSelectedTags] = useState<string[]>();
    const [selectedCategory, setSelectedCategory] = useState<string>();
    const [editorJsValue, setEditorJsValue] = useState();
    const editorCore = React.useRef(null)

    useEffect(() => {

    }, []);

    const toysItems = toys.map((toy: Toy) => {
        return {value: toy.id, label: toy.title}
    })
    const tagsItems = tags.map((tag: Tag) => {
        return {value: tag.id, label: tag.name?.ru}
    })
    const categoriesItems = categories.map((category: Category) => {
        return {value: category.id, label: category.title}
    })

    function handleSubmit(e: any) {
        e.preventDefault();
        console.log("data", data);
        post(route("tasks.store"));
    }

    function handleToysChange(selectedToys: string[]) {
        setSelectedToys(selectedToys);
        setData("toys", selectedToys)
        console.log("DATA", data);
    }

    function handleTagsChange(selectedTags: string[]) {
        console.log("selectedTags", selectedTags);
        setSelectedTags(selectedTags);
        setData("tags", selectedTags)
        console.log("DATA", data);
    }

    function handleCategoryChange(selectedCategory: string) {
        console.log("selectedCategory", selectedCategory)
        setSelectedCategory(selectedCategory);
        console.log("DATA", data);
    }

    const handleInitialize = React.useCallback((instance: any) => {
        console.log("handleInitialize");
        editorCore.current = instance
    }, [])

    const handleSave = React.useCallback(async () => {
        debugger;
        console.log("DATA BEFORE", data);
        const savedData = await editorCore.current.dangerouslyLowLevelInstance?.save();

        setData("content", "123");
    }, [])

    function showData() {
        console.log("DATA NOW", data);
    }

    // const handleSave = React.useCallback(async () => {
    //     const savedData = await editorCore.current.dangerouslyLowLevelInstance?.save();
    //     // setData("content", savedData);
    //     console.log("DATA", data);
    // }, [])

    return (
        <Container>
            <div>
                {/*<h1 className="mb-8 text-3xl font-bold">*/}
                {/*    <InertiaLink*/}
                {/*        href={route("tasks.index")}*/}
                {/*        className="text-indigo-600 hover:text-indigo-700"*/}
                {/*    >*/}
                {/*        tasks*/}
                {/*    </InertiaLink>*/}
                {/*    <span className="font-medium text-indigo-600"> / </span>*/}
                {/*    Create*/}
                {/*</h1>*/}
            </div>
            <form name="createForm" onSubmit={handleSubmit}>
                <TextInput name="title"
                           label="Заголовок"
                           withAsterisk
                           onChange={(e) => {
                               setData("title", e.target.value);
                               console.log("DATA", data);
                           }}/>
                {/*{errors.title}*/}
                <Textarea
                    name="excerpt"
                    placeholder=""
                    label="Краткое описание"
                    withAsterisk
                    onChange={(e) => {
                        setData("excerpt", e.target.value);
                        console.log("DATA", data);
                    }}
                />
                {/*{errors.excerpt}*/}
                <MultiSelect name="toys"
                             label={"Инвентарь"}
                             data={toysItems}
                             value={selectedToys}
                             onChange={handleToysChange}/>
                {/*{errors.toys}*/}
                <MultiSelect name="tags"
                             label={"Теги"}
                             data={tagsItems}
                             value={selectedTags}
                             onChange={handleTagsChange}/>
                {/*{errors.tags}*/}
                <Select name="category"
                        label={"Категория"}
                        data={categoriesItems}
                        value={selectedCategory}
                        onChange={handleCategoryChange}/>
                {/*{errors.category}*/}
                <Input.Wrapper label="Текст задания">
                    <ReactEditorJS
                        onInitialize={handleInitialize}
                        tools={EDITOR_JS_TOOLS}
                        onChange={handleSave}/>
                </Input.Wrapper>
                {/*{errors.content}*/}
                <Group position="right" mt="md">
                    <Button type={"submit"}>Отправить на модерацию</Button>
                    <Button onClick={showData}>Проверить что в DATA</Button>
                </Group>
            </form>
        </Container>
    );
};

export default CreateTask;
