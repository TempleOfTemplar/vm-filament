import React, {useState} from 'react';
import {ColorScheme, ColorSchemeProvider, MantineProvider} from "@mantine/core";
import {Outlet, useLocation} from 'react-router-dom';
import {NotificationsProvider} from "@mantine/notifications";
import Navbar from "../Components/Navbar";
import {Flipper} from "react-flip-toolkit";

const simultaneousAnimations = ({
                                    hideEnteringElements,
                                    animateEnteringElements,
                                    animateExitingElements,
                                    animateFlippedElements
                                }: any) => {
    hideEnteringElements();
    animateExitingElements();
    animateFlippedElements();
    animateEnteringElements();
};


const CommonLayout = () => {
    const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
    const location = useLocation();
    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider theme={{colorScheme}} withGlobalStyles withNormalizeCSS>
                <NotificationsProvider>
                    <Navbar></Navbar>
                    <Flipper
                        flipKey={`${location.pathname}-${location.search}`}
                        handleEnterUpdateDelete={simultaneousAnimations}
                    >
                        <Outlet/>
                    </Flipper>
                </NotificationsProvider>
            </MantineProvider>
        </ColorSchemeProvider>
    );
};

export default CommonLayout;
