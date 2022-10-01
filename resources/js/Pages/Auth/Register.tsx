import React, {useEffect, useState} from 'react';
import {Button, Group, TextInput,} from '@mantine/core';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {showNotification} from "@mantine/notifications";
import {reset, signup} from "../../redux/slices/authSlice";

export default function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {user, isLoading, isSuccess, isError, message} = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })

    const {name, email, password, password_confirmation} = formData;

    useEffect(() => {
        if (isError) {
            showNotification({
                title: 'Ошибка',
                message,
            })
        }
        if (isSuccess && user) {
            navigate('/');
        }

        dispatch(reset())

    }, [user, isSuccess, isError, message, navigate, dispatch])

    const handleChange = (e: any) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (password !== password_confirmation) {
            showNotification({
                title: 'Ошибка',
                message: 'Пароли не совпадают',
            })
        } else if (password.length < 6) {
            // showNotification({
            //     title: 'Ошибка',
            //     message: 'Пароли не совпадают',
            // })
        } else {
            const user = {
                name,
                email,
                password,
                password_confirmation,
            }
            dispatch(signup(user))
        }
        const data = new FormData(e.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                {/*<InputLabel forInput="name" value="Name"/>*/}

                <TextInput
                    type="text"
                    name="name"
                    value={name}
                    label="Имя"
                    className="mt-1 block w-full"
                    autoComplete="name"
                    onChange={handleChange}
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
                    value={email}
                    className="mt-1 block w-full"
                    autoComplete="username"
                    onChange={handleChange}
                    required
                />

                {/*<InputError message={errors.email} className="mt-2"/>*/}
            </div>

            <TextInput
                type="password"
                name="password"
                label='Пароль'
                value={password}
                className="mt-1 block w-full"
                autoComplete="new-password"
                onChange={handleChange}
                required
            />
            <TextInput
                type="password"
                label='Пароль ещё раз'
                name="password_confirmation"
                value={password_confirmation}
                className="mt-1 block w-full"
                onChange={handleChange}
                required
            />

            <Group position="apart" mt="xl">
                <Button className="ml-4" loading={isLoading}>
                    Register
                </Button>
            </Group>
        </form>
    );
}
