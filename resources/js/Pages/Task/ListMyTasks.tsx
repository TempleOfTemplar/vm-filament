import React from 'react';
import TaskCard from "../../Components/TaskCard";
import {Affix, Button, Center, Container, Loader, SimpleGrid, Title} from "@mantine/core";
import {IconCirclePlus} from "@tabler/icons";
import {Task} from "../../Models/Task";
import {useQuery} from "@tanstack/react-query";
import {fetchMyTasks} from "@/services/TasksService";
import {Link} from "react-router-dom";
import {useUpdateIsFavorite} from "@/queries/useSetTaskFavorite";


//href={route("tasks.edit", id)}
const ListMyTasks = () => {
    const {
        isLoading: myTasksLoading,
        error: myTasksError,
        data: myTasksList,
        isFetching: myTasksFetching
    } = useQuery(["myTasks"], fetchMyTasks, {keepPreviousData: true});
    const updateIsFavorite = useUpdateIsFavorite("myTasks");
    const setFavorite = (task: Task) => {
        if (task?.id) {
            updateIsFavorite.mutate(task.id.toString());
        }
    }
    return (
        <>
            <Container>
                <Title order={1}>Мои задания</Title>
                {myTasksLoading ? <Center mt={48}><Loader size={150}/></Center> :
                    <SimpleGrid breakpoints={[
                        {minWidth: 480, cols: 1, spacing: 'sm'},
                        {minWidth: 768, cols: 2, spacing: 'sm'},
                        {minWidth: 1024, cols: 3, spacing: 'sm'},
                    ]}>
                        {myTasksList?.length ? myTasksList.map((task: Task) => (
                            <TaskCard key={task.id} task={task} setFavorite={setFavorite}/>
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

export default ListMyTasks;
