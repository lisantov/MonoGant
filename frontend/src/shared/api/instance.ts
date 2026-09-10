import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { ApiStatus } from './consts';
import { push } from 'notivue';

export const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? '',
    timeout: 6000,
    headers: {
        Accept: 'application/json',
    },
});

console.log(import.meta.env.VITE_API_URL);

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === ApiStatus.UNAUTHORIZED) localStorage.removeItem('token');

        push.error(error.response?.message ?? 'Непредвиденная ошибка');
        return Promise.reject(error);
    }
);
