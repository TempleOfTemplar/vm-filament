import React from 'react';
import TaskCard from "../../Components/TaskCard";
import {Affix, Button, Center, Container, Loader, SimpleGrid, Title} from "@mantine/core";
import {IconCirclePlus} from "@tabler/icons";
import {Task} from "../../Models/Task";
import {useQuery} from "@tanstack/react-query";
import {fetchFavoriteTasks} from "@/services/TasksService";
import {Link} from "react-router-dom";

const FavoritedTasks = () => {
    const {
        isLoading: favoriteTasksLoading,
        error: favoriteTasksError,
        data: favoriteTasksList,
        isFetching: favoriteTasksFetching
    } = useQuery(["favoriteTasks"], fetchFavoriteTasks, {keepPreviousData: true});
    return (
        <>
            <Container>
                <Title order={1}>Избранные задания</Title>
                {favoriteTasksLoading ? <Center mt={48}><Loader size={150}/></Center> :
                    <SimpleGrid breakpoints={[
                        {minWidth: 480, cols: 1, spacing: 'sm'},
                        {minWidth: 768, cols: 2, spacing: 'sm'},
                        {minWidth: 1024, cols: 3, spacing: 'sm'},
                    ]}>
                        {favoriteTasksList?.length ? favoriteTasksList.map((task: Task) => (
                            <TaskCard key={task.id} task={task}/>
                        )) : <div>Ничего не найдено.</div>}
                    </SimpleGrid>
                }
            </Container>

            <Affix position={{bottom: 40, right: 20}}>
                <Button
                    component={Link}
                    to={'/tasks/add'}
                    leftIcon={<IconCirclePlus size={16}/>}
                >
                    Добавить задание
                </Button>
            </Affix>
        </>
    );
};

export default FavoritedTasks;
