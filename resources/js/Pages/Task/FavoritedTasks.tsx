import React from 'react';
import {usePage} from "@inertiajs/inertia-react";
import TaskCard from "../../Components/TaskCard";
import {Affix, Button, Container, SimpleGrid, Title} from "@mantine/core";
import {IconCirclePlus} from "@tabler/icons";
import {Task} from "../../Models/Task";


//href={route("tasks.edit", id)}
const FavoritedTasks = () => {
    const {favoritedTasks} = usePage().props as any;
    console.log(favoritedTasks);
    return (
        <>
            <Container>
                <Title order={1}>Избранные задания</Title>
                <div className="container mx-auto">
                    <div className="overflow-x-auto bg-white rounded shadow">
                        <SimpleGrid cols={3}>
                            {favoritedTasks ? favoritedTasks.map((task: Task) => (
                                <TaskCard key={task.id} task={task}/>
                            )) : null}
                            {favoritedTasks.length === 0 && (
                                <div>Ничего не найдено.</div>
                            )}
                        </SimpleGrid>

                    </div>
                </div>
            </Container>

            <Affix position={{bottom: 40, right: 20}}>
                <Button
                    component='a'
                    href={route("tasks.add")}
                    leftIcon={<IconCirclePlus size={16}/>}
                >
                    Добавить задание
                </Button>
            </Affix>
        </>
    );
};

export default FavoritedTasks;
