import React, {FC, useState} from 'react';
import {Task} from "../Models/Task";
import {IconBookmark, IconHeart, IconMessage, IconPencil, IconShare} from '@tabler/icons';
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
import classNames from "classnames";
import {useSanctum} from "react-sanctum";
import {Link, useHref} from "react-router-dom";
import "./TaskCard.css";
import {Flipped, spring} from "react-flip-toolkit";
import {RWebShare} from "react-web-share";

const onAppear = (el: any, i: any) => {
    spring({
        config: {overshootClamping: true},
        values: {
            scale: [0.25, 1],
            opacity: [0, 1]
        },
        onUpdate: ({opacity, scale}) => {
            el.style.opacity = opacity;
            el.style.transform = `scale(${scale})`;
        },
        delay: i * 50,
        onComplete: () => {
            // add callback logic here if necessary
        }
    });
};

const onExit = (el: any, i: any, removeElement: any) => {
    spring({
        config: {overshootClamping: true},
        values: {
            scale: [1, 0],
            opacity: [1, 0]
        },
        onUpdate: ({opacity, scale}) => {
            el.style.opacity = opacity;
            el.style.transform = `scale(${scale})`;
        },
        delay: i * 5000,
        onComplete: removeElement
    });
};

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        willChange: "opacity, transform"
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
    likeCountText: {
        verticalAlign: 'center',
        lineHeight: '18px',
        marginTop: '-2px',
    },
    bookmark: {
        color: theme.colors.yellow[6]
    },
    bookmarkFilled: {
        fill: theme.colors.yellow[6],
    },
    comment: {},
    editButton: {},
    label: {
        textTransform: 'uppercase',
        fontSize: theme.fontSizes.xs,
        fontWeight: 700,
    },
    footer: {
        padding: `${theme.spacing.xs}px ${theme.spacing.lg}px`,
        marginTop: theme.spacing.md,
        borderTop: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
        }`,
    },
}));

interface TaskCardProps {
    task: Task;
    setFavorite?: (task: Task) => void
    setLike?: (task: Task) => void
}

// const onElementAppear = (el: any, index: any) => {
//     el.classList.remove("animated-card-out");
// }
//
// const onExit = (el: any, index: any, removeElement: any) => {
//     // el.classList.remove("animated-card-in");
//     el.classList.add("animated-card-out");
//     setTimeout(removeElement, 200);
// };

const TaskCard: FC<TaskCardProps> = ({task, setFavorite, setLike}) => {
    const {classes, theme} = useStyles();
    const [commentsOpened, setCommentsOpened] = useState<boolean>(false);
    const {user} = useSanctum();
    const [linkToTask, setLinkToTask] = useState(`${window.location.protocol}${window.location.hostname}/tasks/${task.id}`);
    const [sitesToShare,] = useState([
        'copy',
        'telegram',
        'vk',
        'whatsapp'
    ]);

    function toggleComments(): void {
        setCommentsOpened(!commentsOpened);
    }

    return (
        <Flipped flipId={`task-card-${task.id}`} onAppear={onAppear} onExit={onExit} stagger="task-card">
            <Card withBorder radius="md" p="md"
                  className={classNames(classes.card)}>
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
                            <Center style={{width: '100%'}} className={classes.tagsSection}><Text color="dimmed">У этого
                                задания нет
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
                        {/*<Rating></Rating>*/}
                    </Group>

                    <Card.Section className={classes.footer}>
                        <Group position="apart">
                            <Button component={Link} radius="md" to={`/tasks/${task.id}`}>
                                Читать
                            </Button>
                            <Group spacing={4}>
                                <ActionIcon variant="default" radius="md" size={36}>
                                    <IconMessage size={18}
                                                 onClick={() => toggleComments()}
                                                 className={classNames(classes.comment)}
                                                 stroke={1.5}/>
                                </ActionIcon>
                                {setLike ? <ActionIcon variant="default" radius="md" size={36}>
                                    <Text className={classes.likeCountText}>{task.likers_count}</Text>
                                    <IconHeart size={18}
                                               onClick={() => setLike(task)}
                                               className={classNames(classes.like, {[classes.likeFilled]: task.has_liked})}
                                               stroke={1.5}/>
                                </ActionIcon> : null}
                                {setFavorite ? <ActionIcon variant="default" radius="md" size={36}
                                                           onClick={() => setFavorite(task)}>
                                    <IconBookmark size={18}
                                                  className={classNames(classes.bookmark, {[classes.bookmarkFilled]: task.has_favorited})}
                                                  stroke={1.5}/>
                                </ActionIcon> : null}
                                <RWebShare
                                    sites={sitesToShare}
                                    disableNative={true}
                                    data={{
                                        text: `Вам задание "${task.title}" от virtual-mistress`,
                                        url: linkToTask,
                                        title: "Поделиться заданием",
                                    }}>
                                    <ActionIcon variant="default" radius="md" size={36}>
                                        <IconShare size={16} color={theme.colors.blue[6]} stroke={1.5}/>
                                    </ActionIcon>
                                </RWebShare>
                            </Group>
                        </Group>
                    </Card.Section>
                </>
            </Card>
        </Flipped>
    );
};

export default TaskCard;
