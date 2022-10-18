import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './app';
import {BrowserRouter} from "react-router-dom";
import {Sanctum} from "react-sanctum";
import {QueryParamProvider} from 'use-query-params';
import {ReactRouter6Adapter} from 'use-query-params/adapters/react-router-6';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {HelmetProvider} from 'react-helmet-async';

const container = document.getElementById('app')!;
const root = createRoot(container);
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false
        }
    }
});
const sanctumConfig = {
    apiUrl: "",
    csrfCookieRoute: "sanctum/csrf-cookie",
    signInRoute: "api/login",
    signOutRoute: "api/logout",
    userObjectRoute: "api/auth/user",
};
root.render(
    <HelmetProvider>
        <QueryClientProvider client={queryClient}>
            <Sanctum config={sanctumConfig}>
                    <App/>
            </Sanctum>
        </QueryClientProvider>
    </HelmetProvider>
);
