import React, {FC} from 'react';
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
import {Carousel} from "@mantine/carousel";

const edjsParser = edjsHTML();

const useStyles = createStyles((theme) => ({}));

//href={route("tasks.edit", id)}
const ViewTask: FC<any> = () => {
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
                            slideSize="25%"
                            slideGap="sm"
                            breakpoints={[
                                {maxWidth: 'md', slideSize: '50%'},
                                {maxWidth: 'sm', slideSize: '100%', slideGap: 0},
                            ]}
                            loop
                            align="start"
                        >
                            {task.toys.map((toy: Toy) => (
                                <Carousel.Slide key={toy.title}>
                                    <Paper shadow="md" radius="md" p="sm">
                                        <Image
                                            width={100}
                                            radius="md"
                                            src={toy.image.thumbnail_url}
                                            alt={toy.image.alt}
                                        />
                                        <Text size="lg" weight={500} mt="md">
                                            {toy.title}
                                        </Text>
                                        <Text size="sm" color="dimmed" mt="sm">
                                            {toy.description}
                                        </Text>
                                    </Paper>
                                </Carousel.Slide>
                            ))}
                            {/* ...other slides */}
                        </Carousel>
                    </>
                    : null}
                <Divider my="xs" label="Текст задания" labelPosition="center"/>
                <TypographyStylesProvider>
                    <div dangerouslySetInnerHTML={{__html: html}}></div>
                </TypographyStylesProvider>
            </Paper>
        </Container>
    );
};

export default ViewTask;
