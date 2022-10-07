import React, {FC, useMemo} from 'react';
import {
    Avatar,
    Badge,
    Center,
    Container,
    createStyles,
    Divider,
    Group,
    Image,
    Loader,
    Paper,
    Text,
    Title,
    TypographyStylesProvider
} from "@mantine/core";
import edjsHTML from 'editorjs-html';
import {Carousel} from "@mantine/carousel";
import {useParams} from 'react-router-dom';
import {Tag} from "@/Models/Tag";
import {Toy} from "@/Models/Toy";
import {Flipped, spring} from "react-flip-toolkit";
import {useQuery} from "@tanstack/react-query";
import {getTaskById} from "@/services/TasksService";
import MDEditor from '@uiw/react-md-editor';
import Comment from "@/Components/Comment";

const edjsParser = edjsHTML();

const useStyles = createStyles((theme) => ({}));

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
}

const ViewTask: FC<any> = () => {
        let {taskId} = useParams<string>();

        const {data: task, isLoading: taskLoading} = useQuery(["tasks", taskId], () => getTaskById(taskId));
        const {classes, theme} = useStyles();

        // const html = useMemo(() => {
        //     if (task?.content) {
        //         return edjsParser.parse(JSON.parse(task.content)).join("");
        //     }
        //     return '';
        // }, [task]);

        return (
            <Flipped flipId={`task-card-${taskId}`} onAppear={onAppear}>
                <Container p={0}>
                    {taskLoading ? <Center style={{height: '100%'}} mt={48}><Loader size={150}/></Center> :
                        <Paper shadow={'sm'} p="md" m={0}>
                            <Group position="apart" title='Автор'>
                                <Title order={1}>{task.title}</Title>
                                {task.author ? <Group>
                                    <Avatar src={task.author.avatar} alt={task.author.name} radius="xl" size={'sm'}/>
                                    <div>
                                        <Text weight={500}>
                                            {task.author.name}
                                        </Text>
                                    </div>
                                </Group> : null}
                            </Group>
                            {task.tags?.length ?
                                <>
                                    <Divider my="xs" label="Теги" labelPosition="center"/>
                                    <Group spacing={7} mt={5}>
                                        {task.tags.map((tag: Tag) => (
                                            <Badge
                                                color={theme.colorScheme === 'dark' ? 'dark' : 'gray'}
                                                key={tag?.id}
                                            >
                                                {tag?.name?.ru}
                                            </Badge>
                                        ))}
                                    </Group>
                                </>
                                : null}
                            {task.toys?.length ?
                                <>
                                    <Divider my="xs" label="Требуемый инвентарь" labelPosition="center"/>
                                    <Carousel
                                        withIndicators
                                        height={200}
                                        mx="auto"
                                        slideSize="20%"
                                        slideGap="sm"
                                        slidesToScroll={5}
                                        breakpoints={[
                                            {maxWidth: 'md', slideSize: '50%'},
                                            {maxWidth: 'sm', slideSize: '100%', slideGap: 0},
                                        ]}
                                        align="start"
                                    >
                                        {task.toys.map((toy: Toy) => (
                                            <Carousel.Slide key={toy.title}>
                                                <Paper shadow="md" radius="md" p="sm">
                                                    <Center>
                                                        {toy.image ? <Image
                                                            width={100}
                                                            radius="md"
                                                            src={toy.image.thumbnail_url}
                                                            alt={toy.image.alt}
                                                        /> : null}
                                                    </Center>
                                                    <Center>
                                                        <Text size="lg" weight={500} mt="md">
                                                            {toy.title}
                                                        </Text>
                                                    </Center>
                                                    {/*<Text size="sm" color="dimmed" mt="sm">*/}
                                                    {/*    {toy.description}*/}
                                                    {/*</Text>*/}
                                                </Paper>
                                            </Carousel.Slide>
                                        ))}
                                    </Carousel>
                                </>
                                : null}
                            <Divider my="xs" label="Текст задания" labelPosition="center"/>
                            <TypographyStylesProvider>
                                <MDEditor.Markdown source={task?.content} style={{ whiteSpace: 'pre-wrap' }} />
                            </TypographyStylesProvider>
                        </Paper>}
                    <Paper>
                        {task?.comments?.map((comment) => <Comment key={comment.id} comment={comment}/>)}
                    </Paper>
                </Container>
            </Flipped>
        );
    }
;

export default ViewTask;
