import React, {useEffect, useMemo} from 'react';
import {Button, Center, Container, Group, Input, Loader, MultiSelect, Select, Textarea, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {fetchToys} from "@/services/ToysService";
import {fetchTags} from "@/services/TagsService";
import {fetchCategories} from "@/services/CategoriesService";
import {createTask, editTask, getTaskById} from "@/services/TasksService";
import {Flipped, spring} from "react-flip-toolkit";
import {Task} from "@/Models/Task";
import {useTheme} from "@emotion/react";
import api from "@/utils/Api";
import {Tag} from "@/Models/Tag";
import {Toy} from "@/Models/Toy";
import {Category} from "@/Models/Category";
import {useSanctum} from "react-sanctum";
import {defaultValueCtx, Editor, rootCtx} from '@milkdown/core';
import {nord} from '@milkdown/theme-nord';
import {ReactEditor, useEditor} from '@milkdown/react';
import {commonmark} from '@milkdown/preset-commonmark';
import {listener, listenerCtx} from "@milkdown/plugin-listener";
import {tooltip} from "@milkdown/plugin-tooltip";
import {prism} from "@milkdown/plugin-prism";
import {gfm} from "@milkdown/preset-gfm";
import {menu, menuPlugin} from "@milkdown/plugin-menu";
import {defaultMilkdownToolbarConfig} from "@/Config/Milkdown.toolbar.config";
import {clipboard} from "@milkdown/plugin-clipboard";
import {diagram} from "@milkdown/plugin-diagram";
import {cursor} from "@milkdown/plugin-cursor";
import {emoji} from "@milkdown/plugin-emoji";
import {trailing} from "@milkdown/plugin-trailing";
import {indent} from "@milkdown/plugin-indent";
import {block} from "@milkdown/plugin-block";
import {slash} from "@milkdown/plugin-slash";
import {history} from "@milkdown/plugin-history";

// const ReactEditorJS = createReactEditorJS()
const plugins = [
    "fonts",
    "my-plugins",
    "link",
    "clear",
    "image",
    "logger",
    "mode-toggle",
    "full-screen",
];
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
const CreateOrEditTask = () => {
        let {taskId} = useParams();
        const navigation = useNavigate();
        const theme: any = useTheme();
        const sanctum = useSanctum();

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

        // const [vditor, setVditor] = useState<Vditor>()
        // useEffect(() => {
        //     if (!!vditor) {
        //         console.log(`Update Default Vditor:`)
        //         console.log(vditor)
        //     }
        // }, [vditor])

        const {editor, loading, getInstance} = useEditor((root, renderReact) => {
            // const nodes = commonmark
            //     .configure(image, { view: renderReact(Image) })
            //     .configure(link, { view: renderReact(Link) })
            return Editor.make()
                .config((ctx) => {
                    ctx.set(rootCtx, root);
                    ctx.set(defaultValueCtx, form.values.content);
                    ctx.get(listenerCtx).markdownUpdated((_, value) => {
                        form.values.content = value;
                    });
                })
                .use(nord)
                // .use(nord.override(imagePickerView))
                // .use(commonmark.replace(image, imagePickerPreset()({uploader: MilkdownImagePickerUploader})))
                .use(commonmark)
                .use(tooltip)
                .use(prism)
                .use(gfm)
                .use(history)
                .use(slash)
                .use(block)
                .use(indent)
                .use(trailing)
                .use(emoji)
                // .use(upload.configure(uploadPlugin, {uploader: MilkdownImageUploader}))
                .use(cursor)
                .use(diagram)
                .use(clipboard)
                .use(listener)
                .use(menu.configure(menuPlugin, {config: defaultMilkdownToolbarConfig}))
        });

        // useEffect(() => {
        //     if (!loading) {
        //         const instance = getInstance();
        //         instance?.action((ctx) => {
        //             ctx;
        //             // do something
        //         });
        //     }
        // }, [getInstance, loading]);

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

        const {
            isLoading: toysLoading,
            error: toysError,
            data: toysList,
        } = useQuery(["toys"], fetchToys);
        const {
            isLoading: tagsLoading,
            error: tagsError,
            data: tagsList,
        } = useQuery(["tags"], fetchTags);
        const {
            isLoading: categoriesLoading,
            error: categoriesError,
            data: categoriesList,
        } = useQuery(["categories"], fetchCategories);

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
                return {value: category.id.toString(), label: category.title}
            }) : [];
        }, [categoriesList]);

        const useUpdateTask = useMutation(
            editTask,
            {
                onMutate: async (taskToUpdate: Task) => {
                    await queryClient.cancelQueries(['tasks']);
                    const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);
                    if (previousTasks) {
                        const taskToUpdateIndex = previousTasks.findIndex(task => task.id === taskToUpdate.id);
                        const tasksToUpdate = JSON.parse(JSON.stringify(previousTasks));
                        Object.assign(tasksToUpdate[taskToUpdateIndex], taskToUpdate);
                        console.log("tasksToUpdate[taskToUpdateIndex]", tasksToUpdate[taskToUpdateIndex]);
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
                onSuccess: () => {
                    navigation(-1);
                    // queryClient.cancelQueries(['tasks'])
                    // queryClient.invalidateQueries(['todos'])
                },
            },
        );

        const useCreateTask = useMutation(
            createTask,
            {
                // When mutate is called:
                // onMutate: async (taskToUpdate: Task) => {
                //     await queryClient.cancelQueries(['tasks']);
                //     const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);
                //     if (previousTasks) {
                //         const taskToUpdateIndex = previousTasks.findIndex(task => task.id.toString() === taskToUpdate.id.toString());
                //         const tasksToUpdate = JSON.parse(JSON.stringify(previousTasks));
                //         // tasksToUpdate[taskToUpdateIndex].has_favorited = !tasksToUpdate[taskToUpdateIndex].has_favorited;
                //         Object.assign(tasksToUpdate[taskToUpdateIndex], taskToUpdate);
                //         // console.log("tasksToUpdate[taskToUpdateIndex]", tasksToUpdate[taskToUpdateIndex]);
                //         queryClient.setQueryData<Task[]>(["tasks"], [
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
                // Always refetch after error or success:
                onSuccess: (data) => {
                    console.log("data", data);
                    //const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);
                    //const taskToUpdateIndex = previousTasks.findIndex(task => task.id.toString() === taskToUpdate.id.toString());
                    // console.log(queryClient.getQueryCache().getAll());
                    const queryFromListPage = queryClient.getQueryCache().getAll().filter(query => {
                        return query.queryKey[0] === "task";
                    });
                    if (queryFromListPage?.length) {
                        queryFromListPage.forEach(queryFromListPageItem => {
                            queryFromListPageItem.invalidate();
                        })
                    }
                    navigation('/tasks/my');
                    // queryClient.cancelQueries(['tasks'])
                    // queryClient.invalidateQueries(['todos'])
                },
            },
        )


        function handleSubmit(e: any) {
            e.preventDefault();
            // const vditorValue = vditor?.getValue();
            // if (vditorValue) {
            //     form.values.content = vditorValue;
            // }
            console.log(editor);
            return;
            if (editMode) {
                useUpdateTask.mutate(form.values as any);
            } else {
                useCreateTask.mutate(form.values as any);
            }
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
        // const mdParser = new MarkdownIt(/* Markdown-it options */);

        function handleEditorChange({html, text}: any) {
        }

        const handleImageUpload = async (file: any) => {
            console.log('handleImageUpload', file);
            const formData = new FormData();
            // var imagefile = document.querySelector('#file');
            formData.append("image", file);
            return api().post('/api/tasks/attachImage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((data) => {
                console.log(data.data);
                return data.data.url;
            });
        };

        const handleUpload: IUpload = {
            accept: 'image/*,.mp3,.wav',
            url: '/api/tasks/attachImage',
            withCredentials: true,
            token: "image",
            fieldName: 'image',
            multiple: false,
            error: (error) => {
                console.error("ERROR", error);
            },
            // success(editor, msg) {
            //     let responseData = JSON.parse(msg)
            //     console.log(responseData.url)
            //     return true
            // },
            format: (fileList: File[], responseText: string) => {
                console.log("DATA FORMAT", fileList, responseText);
                const jsonString = decodeURI(responseText)// .replace(/\\/g, '');
                const parsedJson = JSON.parse(jsonString);
                console.log("jsonString", jsonString, parsedJson);
                const succMap = {[parsedJson.url.split('/').pop().toString()]: parsedJson.url.toString()};
                console.log("succMap", succMap);
                console.log("decodeURI", jsonString);
                return JSON.stringify({
                    "msg": '',
                    "code": 0,
                    "data": {
                        errFiles: [],
                        succMap
                    }
                })
            },
            // linkToImgUrl: (data: any) => {
            //     console.log("LINK TO IMAGE:", data);
            //     return data.url;
            // },
            headers: {'X-CSRF-TOKEN': document.querySelector<any>('meta[name="csrf-token"]')?.getAttribute('content')},
            filename(name: string) {
                return name.replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, '').replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, '').replace('/\\s/g', '')
            },
        };

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
                            <Select name="category_id"
                                    label={"Категория"}
                                    data={categoriesItems}
                                    {...form.getInputProps('category_id')}
                            />
                            <Input.Wrapper label="Текст задания" data-color-mode={theme.colorScheme}>
                                {/*<MDEditor*/}
                                {/*    value={form.values.content}*/}
                                {/*    onChange={onEditorValueChanged}*/}
                                {/*    previewOptions={{*/}
                                {/*        rehypePlugins: [[rehypeSanitize]],*/}
                                {/*    }}*/}
                                {/*/>*/}

                                <ReactEditor editor={editor}/>

                                {/*<VditorSVEditor keyID="content-editor" bindVditor={setVditor} options={{*/}
                                {/*    value: form.values.content,*/}
                                {/*    lang: "ru_RU",*/}
                                {/*    minHeight: 400,*/}
                                {/*    typewriterMode: true,*/}
                                {/*    upload: handleUpload,*/}
                                {/*    toolbar: [*/}
                                {/*        "emoji",*/}
                                {/*        "headings",*/}
                                {/*        "bold",*/}
                                {/*        "italic",*/}
                                {/*        "strike",*/}
                                {/*        "link",*/}
                                {/*        "|",*/}
                                {/*        "list",*/}
                                {/*        "ordered-list",*/}
                                {/*        "check",*/}
                                {/*        "outdent",*/}
                                {/*        "indent",*/}
                                {/*        "|",*/}
                                {/*        "quote",*/}
                                {/*        "line",*/}
                                {/*        "code",*/}
                                {/*        "inline-code",*/}
                                {/*        "insert-before",*/}
                                {/*        "insert-after",*/}
                                {/*        "|",*/}
                                {/*        "upload",*/}
                                {/*        "record",*/}
                                {/*        "table",*/}
                                {/*        "|",*/}
                                {/*        "undo",*/}
                                {/*        "redo",*/}
                                {/*        "|",*/}
                                {/*        "fullscreen",*/}
                                {/*        {*/}
                                {/*            name: "attach",*/}
                                {/*            icon: 'edit-mode',*/}
                                {/*            toolbar: [*/}
                                {/*                'edit-mode',*/}
                                {/*                {*/}
                                {/*                    hotkey: '⇧⌘S',*/}
                                {/*                    name: 'sponsor',*/}
                                {/*                    tipPosition: 's',*/}
                                {/*                    tip: 'WTF',*/}
                                {/*                    className: 'right',*/}
                                {/*                    icon: '<svg t="1589994565028" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2808" width="32" height="32"><path d="M506.6 423.6m-29.8 0a29.8 29.8 0 1 0 59.6 0 29.8 29.8 0 1 0-59.6 0Z" fill="#0F0F0F" p-id="2809"></path><path d="M717.8 114.5c-83.5 0-158.4 65.4-211.2 122-52.7-56.6-127.7-122-211.2-122-159.5 0-273.9 129.3-273.9 288.9C21.5 562.9 429.3 913 506.6 913s485.1-350.1 485.1-509.7c0.1-159.5-114.4-288.8-273.9-288.8z" fill="#FAFCFB" p-id="2810"></path><path d="M506.6 926c-22 0-61-20.1-116-59.6-51.5-37-109.9-86.4-164.6-139-65.4-63-217.5-220.6-217.5-324 0-81.4 28.6-157.1 80.6-213.1 53.2-57.2 126.4-88.8 206.3-88.8 40 0 81.8 14.1 124.2 41.9 28.1 18.4 56.6 42.8 86.9 74.2 30.3-31.5 58.9-55.8 86.9-74.2 42.5-27.8 84.3-41.9 124.2-41.9 79.9 0 153.2 31.5 206.3 88.8 52 56 80.6 131.7 80.6 213.1 0 103.4-152.1 261-217.5 324-54.6 52.6-113.1 102-164.6 139-54.8 39.5-93.8 59.6-115.8 59.6zM295.4 127.5c-72.6 0-139.1 28.6-187.3 80.4-47.5 51.2-73.7 120.6-73.7 195.4 0 64.8 78.3 178.9 209.6 305.3 53.8 51.8 111.2 100.3 161.7 136.6 56.1 40.4 88.9 54.8 100.9 54.8s44.7-14.4 100.9-54.8c50.5-36.3 108-84.9 161.7-136.6 131.2-126.4 209.6-240.5 209.6-305.3 0-74.9-26.2-144.2-73.7-195.4-48.2-51.9-114.7-80.4-187.3-80.4-61.8 0-127.8 38.5-201.7 117.9-2.5 2.6-5.9 4.1-9.5 4.1s-7.1-1.5-9.5-4.1C423.2 166 357.2 127.5 295.4 127.5z" fill="#141414" p-id="2811"></path><path d="M353.9 415.6m-33.8 0a33.8 33.8 0 1 0 67.6 0 33.8 33.8 0 1 0-67.6 0Z" fill="#0F0F0F" p-id="2812"></path><path d="M659.3 415.6m-33.8 0a33.8 33.8 0 1 0 67.6 0 33.8 33.8 0 1 0-67.6 0Z" fill="#0F0F0F" p-id="2813"></path><path d="M411.6 538.5c0 52.3 42.8 95 95 95 52.3 0 95-42.8 95-95v-31.7h-190v31.7z" fill="#5B5143" p-id="2814"></path><path d="M506.6 646.5c-59.6 0-108-48.5-108-108v-31.7c0-7.2 5.8-13 13-13h190.1c7.2 0 13 5.8 13 13v31.7c0 59.5-48.5 108-108.1 108z m-82-126.7v18.7c0 45.2 36.8 82 82 82s82-36.8 82-82v-18.7h-164z" fill="#141414" p-id="2815"></path><path d="M450.4 578.9a54.7 27.5 0 1 0 109.4 0 54.7 27.5 0 1 0-109.4 0Z" fill="#EA64F9" p-id="2816"></path><path d="M256 502.7a32.1 27.5 0 1 0 64.2 0 32.1 27.5 0 1 0-64.2 0Z" fill="#EFAFF9" p-id="2817"></path><path d="M703.3 502.7a32.1 27.5 0 1 0 64.2 0 32.1 27.5 0 1 0-64.2 0Z" fill="#EFAFF9" p-id="2818"></path></svg>',*/}
                                {/*                } as IToolbarItem*/}
                                {/*            ]*/}
                                {/*        },*/}
                                {/*        {*/}
                                {/*            name: "more",*/}
                                {/*            toolbar: [*/}
                                {/*                "both",*/}
                                {/*                "code-theme",*/}
                                {/*                "content-theme",*/}
                                {/*                "export",*/}
                                {/*                "outline",*/}
                                {/*                "preview",*/}
                                {/*                "devtools",*/}
                                {/*                "info",*/}
                                {/*                "help",*/}
                                {/*            ],*/}
                                {/*        },*/}
                                {/*    ],*/}
                                {/*    preview: {actions: ["desktop", "tablet", "mobile"]}*/}
                                {/*}}/>*/}
                                {/*<MdEditor style={{height: '500px'}}*/}
                                {/*          value={form.values.content}*/}
                                {/*          renderHTML={text => mdParser.render(text)}*/}
                                {/*          onImageUpload={handleImageUpload}*/}
                                {/*          onChange={handleEditorChange}/>*/}
                            </Input.Wrapper>
                            <Group position="right" mt="md">
                                <Button type={"submit"}>{editMode ? 'Сохранить' : 'Отправить на модерацию'}</Button>
                            </Group>
                        </form>
                    }
                </Container>
            </Flipped>
        );
    }
;

export default CreateOrEditTask;
