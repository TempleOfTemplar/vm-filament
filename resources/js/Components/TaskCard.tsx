import React, {FC} from 'react';
import {Task} from "../Models/Task";
import {IconHeart, IconPencil} from '@tabler/icons';
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
import {useSanctum} from "react-sanctum";
import {Link} from "react-router-dom";

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
    editButton: {},
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
    const {user} = useSanctum();

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
                <Card.Section py={4} px='xs' mt={0} mb={0}>
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
                        <Center style={{width: '100%'}}  className={classes.tagsSection}><Text color="dimmed">У этого задания нет
                            тегов</Text></Center>}
                </Card.Section>


                <Card.Section py={4} px='xs' mt={0} mb={0}>
                    <Divider my={0} label="Инвентарь" labelPosition="center"/>
                    {task.toys?.length ?
                        <>
                            <ScrollArea style={{width: '100%', height: 50}}>
                                <Grid m={0} p={0}>
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
                            </ScrollArea>
                        </>
                        :
                        <Center style={{width: '100%', height: 50}}><Text mt="md" className={classes.label}
                                                                              color="dimmed">
                            Инвентарь не требуется
                        </Text></Center>}
                </Card.Section>


                {task.author ? <Group mt="lg" position="apart">
                    <Group>
                        <Avatar src={task.author.avatar} radius="sm"/>
                        <Text weight={500}>{task.author.name}</Text>
                    </Group>
                    {user && task.author.id === user.id ? <ActionIcon className={classes.editButton}
                                                              component={Link}
                                                              to={`/tasks/edit/${task.id}`}
                                                              variant="default"
                                                              radius="md"
                                                              size={36}
                                                              onClick={() => {
                                                              }}>
                        <IconPencil size={18} stroke={1.5}/>
                    </ActionIcon> : null}
                </Group> : null}

                <Group mt="xs">
                    <Button component={Link} radius="md" style={{flex: 1}} to={`/tasks/${task.id}`}>
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
