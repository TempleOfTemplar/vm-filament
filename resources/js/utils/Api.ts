import axios from "axios";

export default function api() {
    const api = axios.create({
        withCredentials: true,
    });

    return api;
}
