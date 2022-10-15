import React, {FC, useState} from 'react';
import {Avatar, Container, createStyles, Group, Header, Menu, Text, UnstyledButton} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {IconChevronDown, IconTrash,} from '@tabler/icons';
import ApplicationLogo from "./ApplicationLogo";
import DarkThemeToggle from "./DarkThemeToggle";
import {useSanctum, withSanctum} from "react-sanctum";
import {Link} from "react-router-dom";

const HEADER_HEIGHT = 60;
const useStyles = createStyles((theme) => ({
    root: {
        position: 'relative',
        zIndex: 1,
    },

    dropdown: {
        position: 'absolute',
        top: HEADER_HEIGHT,
        left: 0,
        right: 0,
        zIndex: 0,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        borderTopWidth: 0,
        overflow: 'hidden',

        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
    },

    mainGroup: {
        width: '100%'
    },

    links: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    burger: {
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    link: {
        display: 'block',
        lineHeight: 1,
        padding: '8px 12px',
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },

        [theme.fn.smallerThan('sm')]: {
            borderRadius: 0,
            padding: theme.spacing.md,
        },
    },

    linkActive: {
        '&, &:hover': {
            backgroundColor: theme.fn.variant({variant: 'light', color: theme.primaryColor}).background,
            color: theme.fn.variant({variant: 'light', color: theme.primaryColor}).color,
        },
    },
    logo: {
        height: 48
    },
    user: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
        padding: 0,
        borderRadius: theme.radius.sm,
        transition: 'background-color 100ms ease',

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        },
    },
    userActive: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    },
}));

interface NavbarProps {
    user: { name: string; avatar: string };
    toggleColorScheme: () => void
}

// const links = [{link: route("tasks.index"), lavel: "Задания"}];

const AppHeader: FC<NavbarProps> = ({user}) => {
    const {classes, theme, cx} = useStyles();
    const [opened, {toggle}] = useDisclosure(false);
    const [userMenuOpened, setUserMenuOpened] = useState(false);
    const { signOut } = useSanctum();

    return (
        <Header height={HEADER_HEIGHT} mt={0} mb={0} px={16} className={classes.root}>
            <Container className={classes.header} my={0} px={0} py={0}>
                <Group position="apart" my={0} className={classes.mainGroup}>
                    <ApplicationLogo className={classes.logo}/>

                    {user ? <Menu
                        width={260}
                        position="bottom-end"
                        transition="pop-top-right"
                        onClose={() => setUserMenuOpened(false)}
                        onOpen={() => setUserMenuOpened(true)}
                    >
                        <Menu.Target>
                            <UnstyledButton
                                className={cx(classes.user, {[classes.userActive]: userMenuOpened})}
                            >
                                <Group spacing={6}>
                                    <Avatar src={user.avatar} alt={user.name} radius="xl" size={40}/>
                                    <Text weight={500} size="sm" sx={{lineHeight: 1}} mr={3}>
                                        {user.name}
                                    </Text>
                                    <IconChevronDown size={12} stroke={1.5}/>
                                </Group>
                            </UnstyledButton>
                        </Menu.Target>
                        <Menu.Dropdown>
                            {/*<Menu.Item icon={<IconHeart size={14} color={theme.colors.red[6]} stroke={1.5}/>}>*/}
                            {/*    Liked posts*/}
                            {/*</Menu.Item>*/}
                            {/*<Menu.Item icon={<IconStar size={14} color={theme.colors.yellow[6]} stroke={1.5}/>}>*/}
                            {/*    Saved posts*/}
                            {/*</Menu.Item>*/}
                            {/*<Menu.Item icon={<IconMessage size={14} color={theme.colors.blue[6]} stroke={1.5}/>}>*/}
                            {/*    Your comments*/}
                            {/*</Menu.Item>*/}

                            {/*<Menu.Label>Settings</Menu.Label>*/}
                            {/*<Menu.Item icon={<IconSettings size={14} stroke={1.5}/>}>Account settings</Menu.Item>*/}
                            {/*<Menu.Item icon={<IconSwitchHorizontal size={14} stroke={1.5}/>}>*/}
                            {/*    Change account*/}
                            {/*</Menu.Item>*/}
                            {/*<Menu.Item icon={<IconLogout size={14} stroke={1.5}/>}>Logout</Menu.Item>*/}

                            {/*<Menu.Divider/>*/}

                            {/*<Menu.Label>Danger zone</Menu.Label>*/}
                            {/*<Menu.Item icon={<IconPlayerPause size={14} stroke={1.5}/>}>*/}
                            {/*    Pause subscription*/}
                            {/*</Menu.Item>*/}
                            <Menu.Item component={Link} to={'/tasks/favorite'}>
                                Избранные задания
                            </Menu.Item>
                            <Menu.Item component={Link} to={'/tasks/my'}>
                                Мои задания
                            </Menu.Item>
                            <Menu.Item color="red">
                                <DarkThemeToggle/>
                            </Menu.Item>
                            <Menu.Item color="red" icon={<IconTrash size={14} stroke={1.5}/>} onClick={signOut}>
                                Logout
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu> : null}
                </Group>
            </Container>
        </Header>
    );
};

export default withSanctum(AppHeader);
