import React from 'react';
import {usePage} from "@inertiajs/inertia-react";
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

const edjsParser = edjsHTML();

const useStyles = createStyles((theme) => ({}));

//href={route("tasks.edit", id)}
const ViewTask = () => {
    const {task} = usePage().props as any;
    console.log("TASK", task);
    const {classes, theme} = useStyles();

    const html = edjsParser.parse(JSON.parse(task.content)).join("");

    return (
        <Container p={0}>
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
                <Divider my="xs" label="Теги" labelPosition="center"/>
                {task.tags?.length ?
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
                    : null}
                <Divider my="xs" label="Требуемый инвентарь" labelPosition="center"/>
                {task.toys?.length ?
                    <Group spacing={7} mt={5}>
                        {task.toys.map((toy: Toy) => (
                            <Badge leftSection={<Image src={toy.image} alt={toy.title}/>}
                                   color={theme.colorScheme === 'dark' ? 'dark' : 'gray'}
                                   key={toy?.id}
                            >
                                {toy?.title}
                            </Badge>
                        ))}
                    </Group>
                    : null}
                <TypographyStylesProvider>
                    <div dangerouslySetInnerHTML={{__html: html}}></div>
                </TypographyStylesProvider>
            </Paper>
        </Container>
    );
};

export default ViewTask;
