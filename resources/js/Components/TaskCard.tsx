import React, {FC} from 'react';
import {Task} from "../Models/Task";
import {IconHeart} from '@tabler/icons';
import {
    ActionIcon,
    Avatar,
    Badge,
    Button,
    Card,
    Center,
    Col,
    createStyles,
    Divider,
    Grid,
    Group,
    ScrollArea,
    Text
} from '@mantine/core';
import {Toy} from "../Models/Toy";
import {Tag} from "../Models/Tag";
import * as classNames from "classnames";

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    },
    tagsSection: {
        height: 52
    },
    titleAndExcerptSection: {
        display: 'flex',
        flexDirection: 'column',
        height: 190
    },
    toysSection: {
        height: 52
    },
    section: {
        borderBottom: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
        }`
    },

    like: {
        color: theme.colors.red[6],
    },

    likeFilled: {
        fill: theme.colors.red[6],
    },

    label: {
        textTransform: 'uppercase',
        fontSize: theme.fontSizes.xs,
        fontWeight: 700,
    },
}));

interface TaskCardProps {
    task: Task;
    setFavorite?: (task: Task) => void
}

const TaskCard: FC<TaskCardProps> = ({task, setFavorite}) => {
    const {classes, theme} = useStyles();

    return (
        <Card withBorder radius="md" p="md" className={classes.card}>
            <>
                <Card.Section className={classes.titleAndExcerptSection} py={4} px='xs' mt={0} mb={0}>
                    <Text size="lg" weight={500}>
                        {task.title}
                    </Text>
                    {/* TODO task.category <Badge size="sm">{task.category}</Badge>*/}
                    <ScrollArea style={{width: '100%', height: '100%'}} offsetScrollbars={true}>
                        <Text size="sm" mt={0}>
                            {task.excerpt}
                        </Text>
                    </ScrollArea>

                </Card.Section>
                <Card.Section py={4} px='xs' mt={0}>
                    <Divider my={0} label="Теги" labelPosition="center"/>
                    {task.tags?.length ?
                        <ScrollArea style={{width: '100%'}}>
                            <Group spacing={4} mt={0} className={classes.tagsSection}>
                                {task.tags.map((tag: Tag) => (
                                    <Badge
                                        size='md'
                                        variant='outline'
                                        color={theme.colorScheme === 'dark' ? 'dark' : 'gray'}
                                        key={tag?.id}
                                    >
                                        {tag?.name?.ru}
                                    </Badge>
                                ))}
                            </Group>
                        </ScrollArea>
                        :
                        <Center style={{width: '100%', height: '100%'}}><Text color="dimmed">У этого задания нет
                            тегов</Text></Center>}
                </Card.Section>


                <Card.Section py="xs" px={4} mt={0} mb={0}>
                    <Divider my={0} label="Инвентарь" labelPosition="center"/>
                    {task.toys?.length ?
                        <>
                            <ScrollArea style={{width: '100%', height: 44}}>
                                <Grid m={0} p={0} style={{height: 44}}>
                                    {task.toys.map((toy: Toy) => (
                                        // <Image
                                        //     width={50}
                                        //     radius="md"
                                        //     src={toy.image.thumbnail_url}
                                        //     alt={toy.title}
                                        //     caption={toy.title}
                                        // />
                                        <Col span="content" key={toy.id} m={0} p={0}>
                                            <Badge
                                                size='md'
                                                variant='filled'
                                                color={theme.colorScheme === 'dark' ? 'dark' : 'gray'}

                                            >
                                                {toy.title}
                                            </Badge>
                                        </Col>
                                    ))}
                                </Grid>

                                {/*<Group spacing={4} className={classes.toysSection}>*/}
                                {/*    {task.toys.map((toy: Toy) => (*/}
                                {/*        <Badge*/}
                                {/*            size='md'*/}
                                {/*            variant='filled'*/}
                                {/*            color={theme.colorScheme === 'dark' ? 'dark' : 'gray'}*/}
                                {/*            key={toy.id}*/}
                                {/*        >*/}
                                {/*            {toy.title}*/}
                                {/*        </Badge>*/}
                                {/*    ))}*/}
                                {/*</Group>*/}
                            </ScrollArea>
                        </>
                        :
                        <Center style={{width: '100%', height: '100%'}}><Text mt="md" className={classes.label}
                                                                              color="dimmed">
                            Инвентарь не требуется
                        </Text></Center>}
                </Card.Section>


                {task.author ? <Group mt="lg">
                    <Avatar src={task.author.avatar} radius="sm"/>
                    <div>
                        <Text weight={500}>{task.author.name}</Text>
                        {/*<Text size="xs" color="dimmed">*/}
                        {/*    {task.author}*/}
                        {/*</Text>*/}
                    </div>
                </Group> : null}

                <Group mt="xs">
                    <Button component="a" radius="md" style={{flex: 1}} href={route('tasks.show', task)}>
                        Читать
                    </Button>
                    <ActionIcon variant="default" radius="md" size={36}
                                onClick={() => setFavorite ? setFavorite(task) : null}>
                        <IconHeart size={18}
                                   className={classNames(classes.like, {[classes.likeFilled]: task.has_favorited})}
                                   stroke={1.5}/>
                    </ActionIcon>
                </Group>
            </>
        </Card>
    );
};

export default TaskCard;
