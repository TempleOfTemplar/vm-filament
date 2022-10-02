import React from 'react';
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
import {useForm} from "@mantine/form";
import {useSanctum} from "react-sanctum";
import {useLocation, useNavigate} from 'react-router-dom';

const useStyles = createStyles((theme) => ({
    socialLoginButtonIcon: {
        width: 14,
        height: 14
    }
}));

const Login = ()=> {
    const {classes, theme, cx} = useStyles();
    const {authenticated, user, signIn} = useSanctum();
    let location = useLocation();
    let navigate = useNavigate();

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
            remember: false
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Неверный email'),
            password: (value) => value.length > 0 ? null : "Пожалуйста введите пароль",
        },
    });
    const authenticatedCallback = () => {
        // let {from} = location.state || {from: {pathname: '/tasks'}}
        navigate(`/tasks`);
    }

    function onSubmit(values: any) {
        signIn(values.email, values.password, values.remember)
            .then(() => {
               authenticatedCallback();
            })
            .catch(() => window.alert("Incorrect email or password"));
    }

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

            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
                <Stack>
                    <TextInput
                        required
                        label="Email"
                        name="email"
                        placeholder="Your email"
                        {...form.getInputProps('email')}
                    />

                    <PasswordInput
                        required
                        label="Password"
                        name="password"
                        placeholder="Your password"
                        {...form.getInputProps('password')}
                    />

                    <Checkbox
                        name="remember"
                        label="Remember me"
                        {...form.getInputProps('remember', {type: 'checkbox'})}
                    />
                </Stack>

                <Group position="apart" mt="xl">
                    <Button type="submit">Login</Button>
                </Group>
            </form>
        </Paper>
    );
}

export default Login;
