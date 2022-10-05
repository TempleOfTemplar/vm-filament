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
    Paper,
    Text,
    Title,
    TypographyStylesProvider
} from "@mantine/core";
import edjsHTML from 'editorjs-html';
import {Carousel} from "@mantine/carousel";
import {useParams} from 'react-router-dom';
import {useGetApiTasksByTaskQuery} from "@/store/reducers/TasksSlice";
import {skipToken} from "@reduxjs/toolkit/query";
import {Tag} from "@/Models/Tag";
import {Toy} from "@/Models/Toy";
import {Flipped, spring} from "react-flip-toolkit";

const edjsParser = edjsHTML();

const useStyles = createStyles((theme) => ({}));

const onAppear = (el: any, i: any) => {
    el.style.transformOrigin = '0 0';
    spring({
        config: {overshootClamping: true},
        values: {
            scale: [0.25, 1],
            opacity: [1, 1]
        },
        onUpdate: ({opacity, scale}) => {
            // console.log("val", val);
            el.style.opacity = opacity;
            el.style.transform = `scale(${scale})`;
        },
        // delay: i * 50,
        onComplete: () => {
            // add callback logic here if necessary
        }
    });
    // anime({
    //     targets: el,
    //     delay: 250 + i * 30,
    //     opacity: [0, 1],
    //     scale: [0.25, 1],
    //     duration: 250,
    //     easing: "easeOutSine"
    // })
};

const ViewTask: FC<any> = () => {
        let {taskId} = useParams<string>();

        const {
            isLoading: tasksLoading,
            isFetching: tasksFetching,
            error: tasksError,
            data: task
        } = useGetApiTasksByTaskQuery(taskId ? taskId : skipToken);
        const {classes, theme} = useStyles();

        const html = useMemo(() => {
            if (task?.content) {
                return edjsParser.parse(JSON.parse(task.content)).join("");
            }
            return '';
        }, [task]);

        return (
            <Flipped flipId={taskId} onAppear={onAppear}>
                <Container p={0}>
                    {task ? <Paper shadow={'sm'} p="md" m={0}>
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
                            <div dangerouslySetInnerHTML={{__html: html}}></div>
                        </TypographyStylesProvider>
                    </Paper> : null}
                </Container>
            </Flipped>
        );
    }
;

export default ViewTask;
