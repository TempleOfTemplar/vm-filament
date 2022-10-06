import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './app';
import {BrowserRouter} from "react-router-dom";
import {Sanctum} from "react-sanctum";
import {QueryParamProvider} from 'use-query-params';
import {ReactRouter6Adapter} from 'use-query-params/adapters/react-router-6';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

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
    signInRoute: "login",
    signOutRoute: "logout",
    userObjectRoute: "user",
};
root.render(
    <QueryClientProvider client={queryClient}>
        <Sanctum config={sanctumConfig}>
            <BrowserRouter>
                <QueryParamProvider adapter={ReactRouter6Adapter}>
                    <App/>
                </QueryParamProvider>
            </BrowserRouter>
        </Sanctum>
    </QueryClientProvider>
);
