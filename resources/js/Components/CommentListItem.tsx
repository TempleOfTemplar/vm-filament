import React, {FC} from 'react';
import {Avatar, createStyles, Group, Text} from '@mantine/core';
import {TaskComment} from "@/Models/TaskComment";

const useStyles = createStyles((theme) => ({
    body: {
        paddingLeft: 54,
        paddingTop: theme.spacing.sm,
    },
}));


interface TaskCommentProps {
    comment: TaskComment;
}

const CommentListItem: FC<TaskCommentProps> = ({comment}) => {
    const {classes} = useStyles();

    return (
        <div>
            <Group>
                <Avatar src={comment.user.avatar} alt={comment.user.name} radius="xl"/>
                <div>
                    <Text size="sm">{comment.user.name}</Text>
                    <Text size="xs" color="dimmed">
                        {comment.updated_at.toString()}
                    </Text>
                </div>
            </Group>
            <Text className={classes.body} size="sm">
                {comment.content}
            </Text>
        </div>
    );
};

export default CommentListItem;
