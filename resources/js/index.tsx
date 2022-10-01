import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import {BrowserRouter, Link} from "react-router-dom";
import {Sanctum} from "react-sanctum";

const container = document.getElementById('app')!;
const root = createRoot(container);

const sanctumConfig = {
    apiUrl: "",
    csrfCookieRoute: "sanctum/csrf-cookie",
    signInRoute: "login",
    signOutRoute: "logout",
    userObjectRoute: "user",
};
console.log("WTF");

root.render(
    <Sanctum config={sanctumConfig}>
        <BrowserRouter>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <App/>
        </BrowserRouter>
    </Sanctum>
);
