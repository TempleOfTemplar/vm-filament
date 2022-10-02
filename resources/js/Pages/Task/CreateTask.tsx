import React, {useEffect, useMemo, useState} from 'react';
import {createReactEditorJS} from "react-editor-js";
import {Button, Container, Group, Input, MultiSelect, Select, Textarea, TextInput} from "@mantine/core";
import {EDITOR_JS_TOOLS} from "../../utils/EditorJsToolbar";
import {Tag} from "../../Models/Tag";
import {Toy} from "../../Models/Toy";
import {Category} from "../../Models/Category";
import {useForm} from "@mantine/form";
import api from "../../utils/Api";

const ReactEditorJS = createReactEditorJS()


const CreateTask = () => {
    const form = useForm({
        initialValues: {
            title: '',
            excerpt: '',
            toys: [],
            tags: [],
            category: '',
            content: ''
        },

        validate: {
            title: (value) => value.length > 0 ? null : "Пожалуйста введите пароль",
        },
    });

    const [selectedToys, setSelectedToys] = useState<string[]>();
    const [selectedTags, setSelectedTags] = useState<string[]>();
    const [selectedCategory, setSelectedCategory] = useState<string>();
    const [editorJsValue, setEditorJsValue] = useState();

    const [toysList, setToysList] = useState<Toy[]>();
    const [tagsList, setTagsList] = useState<Tag[]>();
    const [categoriesList, setCategoriesList] = useState<Category[]>();

    const editorCore = React.useRef(null)

    useEffect(() => {
        api().get("/api/toys")
            .then((res) => {
                setToysList(res.data.data);
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
        // data.content = editorJsValue;
        // console.log(data);
        // post(route("tasks.store"));
    }

    // function handleToysChange(selectedToys: string[]) {
    //     setSelectedToys(selectedToys);
    //     setData("toys", selectedToys)
    // }
    //
    // function handleTagsChange(selectedTags: string[]) {
    //     setSelectedTags(selectedTags);
    //     setData("tags", selectedTags)
    // }
    //
    // function handleCategoryChange(selectedCategory: string) {
    //     setSelectedCategory(selectedCategory);
    //     setData("category", selectedCategory)
    // }

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
                        onInitialize={handleInitialize}
                        tools={EDITOR_JS_TOOLS}
                        onChange={handleSave}/>
                </Input.Wrapper>
                {/*{errors.content}*/}
                <Group position="right" mt="md">
                    <Button type={"submit"}>Отправить на модерацию</Button>
                </Group>
            </form>
        </Container>
    );
};

export default CreateTask;
