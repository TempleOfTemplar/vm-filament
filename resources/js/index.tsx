import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import {BrowserRouter, Link} from "react-router-dom";
import {Sanctum} from "react-sanctum";
import {QueryParamProvider} from 'use-query-params';
import {ReactRouter6Adapter} from 'use-query-params/adapters/react-router-6';
import {Provider} from "react-redux";

const container = document.getElementById('app')!;
const root = createRoot(container);

const sanctumConfig = {
    apiUrl: "",
    csrfCookieRoute: "sanctum/csrf-cookie",
    signInRoute: "login",
    signOutRoute: "logout",
    userObjectRoute: "user",
};
root.render(
    // <Provider store={store}>
    <Sanctum config={sanctumConfig}>
        <BrowserRouter>
            <QueryParamProvider adapter={ReactRouter6Adapter}>
                <App/>
            </QueryParamProvider>
        </BrowserRouter>
    </Sanctum>
    // </Provider>
);
