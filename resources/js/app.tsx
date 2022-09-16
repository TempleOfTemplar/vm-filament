import './bootstrap';
import '../css/app.css';

import React from 'react';
import {createInertiaApp} from '@inertiajs/inertia-react';
import {InertiaProgress} from '@inertiajs/progress';
import {resolvePageComponent} from 'laravel-vite-plugin/inertia-helpers';
import {createRoot} from "react-dom/client";
import 'clockwork-browser/toolbar'
import {MantineProvider} from '@mantine/core';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({el, App, props}) {
        const root = createRoot(el); // createRoot(container!) if you use TypeScript
        return root.render(
            <MantineProvider withGlobalStyles withNormalizeCSS>
                <App {...props} />
            </MantineProvider>
        );
    },
});

InertiaProgress.init({color: '#4B5563'});
