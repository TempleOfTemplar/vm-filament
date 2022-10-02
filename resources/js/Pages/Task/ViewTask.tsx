import React, {FC, useEffect, useMemo, useState} from 'react';
import {
    Avatar,
    Badge,
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
import {Tag} from "../../Models/Tag";
import edjsHTML from 'editorjs-html';
import {Toy} from "../../Models/Toy";
import {Carousel} from "@mantine/carousel";
import api from "../../utils/Api";
import {useParams} from 'react-router-dom';

const edjsParser = edjsHTML();

const useStyles = createStyles((theme) => ({}));

const ViewTask: FC<any> = () => {
    const [task, setTask] = useState();
    let {taskId} = useParams();
    useEffect(() => {
        api().get(`/api/tasks/${taskId}`)
            .then((res) => {
                setTask(res.data.data);
            })
            .catch((err) => {
            });
    }, []);
    const {classes, theme} = useStyles();

    const html = useMemo(() => {
        if (task?.content) {
            return edjsParser.parse(JSON.parse(task.content)).join("");
        }
        return '';
    }, [task]);

    return (
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
                            breakpoints={[
                                {maxWidth: 'md', slideSize: '50%'},
                                {maxWidth: 'sm', slideSize: '100%', slideGap: 0},
                            ]}
                            align="start"
                        >
                            {task.toys.map((toy: Toy) => (
                                <Carousel.Slide key={toy.title}>
                                    <Paper shadow="md" radius="md" p="sm">
                                        {toy.image ? <Image
                                            width={100}
                                            radius="md"
                                            src={toy.image.thumbnail_url}
                                            alt={toy.image.alt}
                                        /> : null}
                                        <Text size="lg" weight={500} mt="md">
                                            {toy.title}
                                        </Text>
                                        <Text size="sm" color="dimmed" mt="sm">
                                            {toy.description}
                                        </Text>
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
    );
};

export default ViewTask;
