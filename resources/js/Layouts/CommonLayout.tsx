import React, {useState} from 'react';
import {ColorScheme, ColorSchemeProvider, MantineProvider} from "@mantine/core";

const CommonLayout = ({children}) => {
    const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider theme={{colorScheme}} withGlobalStyles withNormalizeCSS>
                {children}
            </MantineProvider>
        </ColorSchemeProvider>
    );
};

export default CommonLayout;
