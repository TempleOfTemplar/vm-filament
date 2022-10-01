import React from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import App from './App';
import store from "./redux/store";
import {BrowserRouter, Link} from "react-router-dom";

const container = document.getElementById('app')!;
const root = createRoot(container);

root.render(
    <Provider store={store}>
        <BrowserRouter>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <App/>
        </BrowserRouter>
    </Provider>
);
