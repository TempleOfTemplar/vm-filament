import React, {useEffect} from 'react';
import {useForm} from '@inertiajs/inertia-react';
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
import VkontakteButton from "../../Components/VkontakteButton";
import GoogleButton from "../../Components/GoogleButton";

const useStyles = createStyles((theme) => ({
    socialLoginButtonIcon: {
        width: 14,
        height: 14
    }
}));

export default function Login({status, canResetPassword}) {
    const {classes, theme, cx} = useStyles();
    const {data, setData, post, processing, errors, reset} = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <Paper radius="md" p="xl" withBorder>
            <Text size="lg" weight={500}>
                Welcome to Mantine, login with
            </Text>

            <Group grow mb="md" mt="md">
                <GoogleButton href={route('auth.google')} radius="xl">Google</GoogleButton>
                <VkontakteButton href={route('auth.vk')} radius="xl">Vkontakte</VkontakteButton>
            </Group>

            <Divider label="Or continue with email" labelPosition="center" my="lg"/>

            <form onSubmit={submit}>
                <Stack>
                    <TextInput
                        required
                        label="Email"
                        name="email"
                        placeholder="Your email"
                        value={data.email}
                        onChange={onHandleChange}
                        error={errors.email}
                    />

                    <PasswordInput
                        required
                        label="Password"
                        name="password"
                        placeholder="Your password"
                        value={data.password}
                        onChange={onHandleChange}
                        error={errors.password}
                    />

                    <Checkbox
                        name="remember"
                        label="Remember me"
                        checked={data.remember}
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
