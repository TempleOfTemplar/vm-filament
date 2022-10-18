import React, {FC, useEffect, useState} from 'react';
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
    Modal,
    Paper,
    Text,
    Title,
    TypographyStylesProvider
} from '@mantine/core';
import {Flipped, spring} from "react-flip-toolkit";
import {Tag} from "@/Models/Tag";
import {Carousel} from "@mantine/carousel";
import {Toy} from "@/Models/Toy";
import MDEditor from "@uiw/react-md-editor";
import {useQuery} from "@tanstack/react-query";
import {fetchTaskById} from "@/services/TasksService";
import {useParams} from "react-router-dom";

const useStyles = createStyles((theme) => ({}));
type ViewTaskModalProps = {
    onClose: () => void
}
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
const ViewTaskModal: FC<ViewTaskModalProps> = ({onClose}) => {
    let {taskId} = useParams<string>();

    const {data: task, isLoading: taskLoading} = useQuery(["tasks", taskId], () => fetchTaskById(taskId));
    const {classes, theme} = useStyles();
    const [opened, setOpened] = useState(false);
    useEffect(() => {
        setOpened(true);
    }, [])

    return (
        <Flipped flipId={`task-card-${taskId}`} onAppear={onAppear}>
            <Modal
                opened={opened}
                onClose={onClose}
                title="This is fullscreen modal!"
                transition="pop"
                transitionDuration={200}
                transitionTimingFunction="ease"
                fullScreen
            >
                <Container p={0}>
                    {taskLoading ? <Center style={{height: '100%'}} mt={48}><Loader size={150}/></Center> :
                        <Paper shadow={'sm'} p="md" m={0}>
                            <Group position="apart" title='Автор'>
                                <Title order={1}>{task.title}</Title>
                                {task.author ? <Group>
                                    <Avatar src={task.author.avatar} alt={task.author.name} radius="xl"
                                            size={'sm'}/>
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
                                <MDEditor.Markdown source={task?.content} style={{whiteSpace: 'pre-wrap'}}/>
                                {/*<div dangerouslySetInnerHTML={{__html: html}}></div>*/}
                            </TypographyStylesProvider>
                        </Paper>}
                </Container>
            </Modal>
        </Flipped>
    );
};

export default ViewTaskModal;
