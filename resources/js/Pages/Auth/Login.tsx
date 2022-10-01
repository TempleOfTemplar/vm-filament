import React, {useEffect, useState} from 'react';
import {
    Button,
    Checkbox,
    createStyles,
    Divider,
    Group,
    Paper,
    PasswordInput,
    Stack,
    Text,
    TextInput,
} from '@mantine/core';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from 'react-router-dom';
import {reset, signin} from "../../redux/slices/authSlice";
import {showNotification} from '@mantine/notifications';

const useStyles = createStyles((theme) => ({
    socialLoginButtonIcon: {
        width: 14,
        height: 14
    }
}));

export default function Login() {
    const {classes, theme, cx} = useStyles();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {user, isLoading, isSuccess, isError, message} = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false
    })
    useEffect(() => {
        if (isError) {
            showNotification({
                title: 'Ошибка',
                message,
            })
            // toast.error(message)
        }
        if (isSuccess && user) {
            navigate('/');
        }

        dispatch(reset())
    }, [user, isSuccess, isError, message, navigate, dispatch])

    const onHandleChange = (event: any) => {
        // setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
        event.preventDefault();
        const user: any = {...formData};
        dispatch(signin(user))
    };

    const submit = (e: any) => {
        e.preventDefault();
    };

    return (
        <Paper radius="md" p="xl" withBorder>
            <Text size="lg" weight={500}>
                Welcome to Mantine, login with
            </Text>

            <Group grow mb="md" mt="md">
                {/*<GoogleButton href={route('auth.google')} radius="xl">Google</GoogleButton>*/}
                {/*<VkontakteButton href={route('auth.vk')} radius="xl">Vkontakte</VkontakteButton>*/}
            </Group>

            <Divider label="Or continue with email" labelPosition="center" my="lg"/>

            <form onSubmit={submit}>
                <Stack>
                    <TextInput
                        required
                        label="Email"
                        name="email"
                        placeholder="Your email"
                        value={formData.email}
                        onChange={onHandleChange}
                    />

                    <PasswordInput
                        required
                        label="Password"
                        name="password"
                        placeholder="Your password"
                        value={formData.password}
                        onChange={onHandleChange}
                    />

                    <Checkbox
                        name="remember"
                        label="Remember me"
                        checked={formData.remember}
                        onChange={onHandleChange}
                    />
                </Stack>

                <Group position="apart" mt="xl">
                    <Button type="submit">Login</Button>
                </Group>
            </form>
        </Paper>
    );
}
