import React, {FC} from 'react';
import {Task} from "../Models/Task";
import {IconHeart} from '@tabler/icons';
import {ActionIcon, Avatar, Badge, Button, Card, createStyles, Group, Text} from '@mantine/core';
import {Toy} from "../Models/Toy";
import {Tag} from "../Models/Tag";

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    },

    section: {
        borderBottom: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
        }`,
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        paddingBottom: theme.spacing.md,
    },

    like: {
        color: theme.colors.red[6],
    },

    label: {
        textTransform: 'uppercase',
        fontSize: theme.fontSizes.xs,
        fontWeight: 700,
    },
}));

interface TaskCardProps {
    task: Task;
}

const TaskCard: FC<TaskCardProps> = ({task}) => {
    const {classes, theme} = useStyles();

    return (
        <Card withBorder radius="md" p="md" className={classes.card}>
            <Card.Section className={classes.section}>
                {task.tags?.length ?
                    <Group spacing={7} mt={5}>
                        {task.tags.map((tag: Tag) => (
                            <Badge
                                color={theme.colorScheme === 'dark' ? 'dark' : 'gray'}
                                key={tag.id}
                            >
                                {tag.name.ru}
                            </Badge>
                        ))}
                    </Group>
                    : null}
            </Card.Section>
            {/*<Card.Section>*/}
            {/*    <Image src={task.image} alt={task.title} height={180}/>*/}
            {/*</Card.Section>*/}

            <Card.Section className={classes.section} mt="md">
                <Group position="apart">
                    <Text size="lg" weight={500}>
                        {task.title}
                    </Text>
                    {/* TODO task.category <Badge size="sm">{task.category}</Badge>*/}
                </Group>
                <Text size="sm" mt="xs">
                    {task.excerpt}
                </Text>
            </Card.Section>
            <Card.Section className={classes.section}>
                {task.toys?.length ?
                    <>
                        <Text mt="md" className={classes.label} color="dimmed">
                            Инвентарь:
                        </Text>
                        <Group spacing={7} mt={5}>
                            {task.toys.map((toy: Toy) => (
                                <Badge
                                    color={theme.colorScheme === 'dark' ? 'dark' : 'gray'}
                                    key={toy.id}
                                >
                                    {toy.title}
                                </Badge>
                            ))}
                        </Group>
                    </>
                    : <Text mt="md" className={classes.label} color="dimmed">
                        Инвентарь не требуется
                    </Text>}
            </Card.Section>


            <Group mt="lg">
                <Avatar src={task.author.avatar} radius="sm"/>
                <div>
                    <Text weight={500}>{task.author.name}</Text>
                    <Text size="xs" color="dimmed">
                        {/*{author.description}*/}
                    </Text>
                </div>
            </Group>

            <Group mt="xs">
                <Button radius="md" style={{flex: 1}}>
                    Show details
                </Button>
                <ActionIcon variant="default" radius="md" size={36}>
                    <IconHeart size={18} className={classes.like} stroke={1.5}/>
                </ActionIcon>
            </Group>
        </Card>
    );
};

export default TaskCard;
