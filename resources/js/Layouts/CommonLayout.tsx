import React, {useState} from 'react';
import {ColorScheme, ColorSchemeProvider, MantineProvider} from "@mantine/core";
import {usePage} from "@inertiajs/inertia-react";
import AuthenticatedLayout from "./AuthenticatedLayout";
import GuestLayout from "./GuestLayout";

const CommonLayout = ({children, auth}) => {
    const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider theme={{colorScheme}} withGlobalStyles withNormalizeCSS>
                {auth && auth.user ? <AuthenticatedLayout auth={auth}>{children}</AuthenticatedLayout> :
                    <GuestLayout>{children}</GuestLayout>}
            </MantineProvider>
        </ColorSchemeProvider>
    );
};

export default CommonLayout;
