import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios';

export const createHttpClient = (config: CreateAxiosDefaults): AxiosInstance => {
    const client = axios.create({
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
        ...config,
    });

    client.interceptors.response.use(
        (response) => response,
        (error) => {
            return Promise.reject(error);
        }
    );

    return client;
};