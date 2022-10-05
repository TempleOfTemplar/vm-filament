import axios, {AxiosInstance} from "axios";

export default function api(): AxiosInstance {
    const api = axios.create({
        withCredentials: true,
    });

    return api;
}
