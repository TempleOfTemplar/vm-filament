import React from 'react';
import {Button, Group, TextInput,} from '@mantine/core';
import {useNavigate} from "react-router-dom";
import {useForm} from "@mantine/form";
import {withSanctum} from "react-sanctum";
import axios from "axios";

const Register = ({setUser}) => {
    const navigate = useNavigate();

    // const { loading, userInfo, error, success } = useSelector(
    //     (state) => state.user
    // )

    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            password: ''
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    function onSubmit(values: any) {
        console.log("WTF2");
        axios
            .post(`api/register`, values)
            .then(function (response) {
                const user = response.data;
                setUser(user); // The react-sanctum setUser function
                authenticatedCallback();
            })
            .catch(function (error) {
            });
    }

    const authenticatedCallback = () => {
        // let {from} = location.state || {from: {pathname: '/tasks'}}
        navigate(`/tasks`);
    }

    return (
        <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
            <div>
                {/*<InputLabel forInput="name" value="Name"/>*/}

                <TextInput
                    type="text"
                    name="name"
                    label="Имя"
                    className="mt-1 block w-full"
                    autoComplete="name"
                    {...form.getInputProps('name')}
                    required
                />

                {/*<InputError message={errors.name} className="mt-2"/>*/}
            </div>

            <div className="mt-4">
                {/*<InputLabel forInput="email" value="Email"/>*/}

                <TextInput
                    type="email"
                    name="email"
                    label="Email"
                    className="mt-1 block w-full"
                    autoComplete="username"
                    {...form.getInputProps('email')}
                    required
                />

                {/*<InputError message={errors.email} className="mt-2"/>*/}
            </div>

            <TextInput
                type="password"
                name="password"
                label='Пароль'
                className="mt-1 block w-full"
                autoComplete="new-password"
                {...form.getInputProps('password')}
                required
            />

            <Group position="apart" mt="xl">
                <Button className="ml-4" type={"submit"} loading={false}>
                    Register
                </Button>
            </Group>
        </form>
    );
}
export default withSanctum(Register);
