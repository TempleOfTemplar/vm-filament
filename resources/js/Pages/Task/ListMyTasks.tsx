import React from 'react';
import {usePage} from "@inertiajs/inertia-react";
import TaskCard from "../../Components/TaskCard";
import {Affix, Button, Container, SimpleGrid, Title} from "@mantine/core";
import {IconCirclePlus} from "@tabler/icons";
import {Task} from "../../Models/Task";


//href={route("tasks.edit", id)}
const ListMyTasks = () => {
    const {tasks} = usePage().props as any;

    return (
        <>
            <Container>
                <Title order={1}>Мои задания</Title>
                <div className="container mx-auto">
                    <div className="overflow-x-auto bg-white rounded shadow">
                        <SimpleGrid cols={3}>
                            {tasks ? tasks.map((task: Task) => (
                                <TaskCard key={task.id} task={task}/>
                            )) : null}
                            {tasks.length === 0 && (
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

export default ListMyTasks;
