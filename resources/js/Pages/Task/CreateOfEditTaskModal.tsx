import React, {FC, useEffect, useMemo, useState} from 'react';
import {useParams} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createTask, editTask, getTaskById} from "@/services/TasksService";
import {Tag} from "@/Models/Tag";
import {Toy} from "@/Models/Toy";
import {useForm} from "@mantine/form";
import {fetchToys} from "@/services/ToysService";
import {fetchTags} from "@/services/TagsService";
import {fetchCategories} from "@/services/CategoriesService";
import {Category} from "@/Models/Category";
import {Task} from "@/Models/Task";
import {OutputData} from "@editorjs/editorjs";
import {Flipped, spring} from "react-flip-toolkit";
import {Button, Center, Container, Group, Input, Loader, MultiSelect, Select, Textarea, TextInput} from "@mantine/core";
import MDEditor from "@uiw/react-md-editor";

const onAppear = (el: any, i: any) => {
    spring({
        config: {overshootClamping: true},
        values: {
            scale: [0.25, 1],
            opacity: [1, 1]
        },
        onUpdate: ({opacity, scale}) => {
            el.style.opacity = opacity;
            el.style.transform = `scale(${scale})`;
        },
        onComplete: () => {
            // add callback logic here if necessary
        }
    });
};

type CreateOrEditTaskModalProps = {
    onClose: () => void
}

const CreateOfEditTaskModal: FC<CreateOrEditTaskModalProps> = () => {
    let {taskId} = useParams();
    const editMode = useMemo(() => {
        return !(taskId === undefined);
    }, [taskId]);
    const {data: task, isLoading: taskLoading} = useQuery(["tasks", taskId], () => getTaskById(taskId), {
        enabled: editMode
    });
    const queryClient = useQueryClient();
    useEffect(() => {
        if (task) {
            form.setValues({
                id: task.id,
                title: task.title,
                excerpt: task.excerpt,
                category_id: task.category_id.toString(),
                tags: task.tags ? task.tags.map((tag: Tag) => tag.id) : [],
                toys: task.toys ? task.toys.map((toy: Toy) => toy.id) : [],
                content: task.content
            });
        }
    }, [task]);


    const form = useForm({
        initialValues: {
            title: '',
            excerpt: '',
            toys: [],
            tags: [],
            category_id: '',
            content: ''
        },

        validate: {
            title: (value) => value.length > 0 ? null : "Пожалуйста введите пароль",
        },
    });

    const [editorValue, setEditorValue] = useState('')
    const {
        isLoading: toysLoading,
        error: toysError,
        data: toysList,
    } = useQuery(["toysList"], fetchToys);
    const {
        isLoading: tagsLoading,
        error: tagsError,
        data: tagsList,
    } = useQuery(["tagsList"], fetchTags);
    const {
        isLoading: categoriesLoading,
        error: categoriesError,
        data: categoriesList,
    } = useQuery(["categoriesList"], fetchCategories);

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

    const useUpdateTask = useMutation(
        editTask,
        {
            // When mutate is called:
            // onMutate: async (task: Task) => {
            //     await queryClient.cancelQueries(['tasks']);
            //     const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);
            //     if (previousTasks) {
            //         const taskToUpdateIndex = previousTasks.findIndex(task => task.id.toString() === taskId);
            //         const tasksToUpdate = JSON.parse(JSON.stringify(previousTasks));
            //         tasksToUpdate[taskToUpdateIndex].has_favorited = !tasksToUpdate[taskToUpdateIndex].has_favorited;
            //         queryClient.setQueryData<Task[]>(["tasks", query], [
            //             ...tasksToUpdate,
            //         ])
            //     }
            //     return previousTasks ? {previousTasks} : {previousTasks: []};
            // },
            // // If the mutation fails, use the context returned from onMutate to roll back
            // onError: (err, variables, context) => {
            //     if (context) {
            //         queryClient.setQueryData<Task[]>(['tasks'], [...context.previousTasks])
            //     }
            // },
            // // Always refetch after error or success:
            // onSettled: () => {
            //     // queryClient.cancelQueries(['tasks'])
            //     // queryClient.invalidateQueries(['todos'])
            // },
        },
    );

    const useCreateTask = useMutation(
        createTask,
        {
            // When mutate is called:
            onMutate: async (task: Task) => {
                await queryClient.cancelQueries(['tasks']);
                const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);
                if (previousTasks) {
                    const taskToUpdateIndex = previousTasks.findIndex(task => task.id.toString() === taskId);
                    const tasksToUpdate = JSON.parse(JSON.stringify(previousTasks));
                    tasksToUpdate[taskToUpdateIndex].has_favorited = !tasksToUpdate[taskToUpdateIndex].has_favorited;
                    queryClient.setQueryData<Task[]>(["tasks"], [
                        ...tasksToUpdate,
                    ])
                }
                return previousTasks ? {previousTasks} : {previousTasks: []};
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err, variables, context) => {
                if (context) {
                    queryClient.setQueryData<Task[]>(['tasks'], [...context.previousTasks])
                }
            },
            // Always refetch after error or success:
            onSettled: () => {
                // queryClient.cancelQueries(['tasks'])
                // queryClient.invalidateQueries(['todos'])
            },
        },
    )

    function handleSubmit(e: any) {
        e.preventDefault();
        console.log(e);
        console.log("form", form.values);
        if (editMode) {
            useUpdateTask.mutate(form.values as any);
        } else {

        }
    }

    function onEditorValueChanged(value: any) {
        form.setFieldValue('content', value);
    }

    async function handleSave(data: OutputData) {
        console.log("data", data);
        // const savedData = await editorCore.current.save();
        // form.setFieldValue('content', data);
    }

    // const handleImageUpload = useCallback(
    //     (file: File): Promise<string> =>
    //         new Promise((resolve, reject) => {
    //             const formData = new FormData();
    //             formData.append('image', file);
    //
    //             fetch('https://api.imgbb.com/1/upload?key=api_key', {
    //                 method: 'POST',
    //                 body: formData,
    //             })
    //                 .then((response) => response.json())
    //                 .then((result) => resolve(result.data.url))
    //                 .catch(() => reject(new Error('Upload failed')));
    //         }),
    //     []
    // );

    return (
        <Flipped flipId={`task-card-${taskId}`} onAppear={onAppear}>
            <Container>
                {editMode && taskLoading ? <Center mt={48}><Loader size={150}/></Center> :
                    <form name="createForm" onSubmit={handleSubmit}>
                        <TextInput name="title"
                                   label="Заголовок"
                                   withAsterisk
                                   {...form.getInputProps('title')}/>
                        <Textarea
                            name="excerpt"
                            placeholder=""
                            label="Краткое описание"
                            withAsterisk
                            {...form.getInputProps('excerpt')}
                        />
                        <MultiSelect name="toys"
                                     label={"Инвентарь"}
                                     data={toysItems}
                                     {...form.getInputProps('toys')}
                        />
                        <MultiSelect name="tags"
                                     label={"Теги"}
                                     data={tagsItems}
                                     {...form.getInputProps('tags')}
                        />
                        {/*{errors.tags}*/}
                        <Select name="category"
                                label={"Категория"}
                                data={categoriesItems}
                                {...form.getInputProps('category_id')}
                            // value={selectedCategory}
                            // onChange={handleCategoryChange}
                        />
                        <Input.Wrapper label="Текст задания">
                            <MDEditor
                                value={form.values.content}
                                onChange={onEditorValueChanged}
                            />
                        </Input.Wrapper>
                        <Group position="right" mt="md">
                            <Button type={"submit"}>{editMode ? 'Сохранить' : 'Отправить на модерацию'}</Button>
                        </Group>
                    </form>
                }
            </Container>
        </Flipped>
    );
};

export default CreateOfEditTaskModal;
