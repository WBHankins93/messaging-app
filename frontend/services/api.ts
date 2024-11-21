import axios, { AxiosResponse } from "axios";
import { getToken } from "../utils/sessionStorage";
import { config } from "process";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const token = getToken("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;


// Define a type for the signup response
export interface SignupResponse {
    message: string;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

export interface RefreshResponse {
    access_token: string;
    token_type: string;
}

// register a new user
export const signup = (username: string, password:string): Promise<AxiosResponse<SignupResponse>> =>
    apiClient.post("/signup", { username, password });

// log in user and get token
export const login = (username: string, password:string): Promise<AxiosResponse<LoginResponse>> =>
    apiClient.post<LoginResponse>("/token", new URLSearchParams({ username, password }).toString(),
        {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
    );

// refresh access token 
export const refreshAccessToken = (refreshToken: string): Promise<AxiosResponse<RefreshResponse>> =>
    apiClient.post<RefreshResponse>("/token/refresh", { refresh_token: refreshToken });

export const fetchMessages = (token: string, roomId: string): Promise<AxiosResponse<any>> =>
    apiClient.get(`/chat/history?room_id=${roomId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

// Admin-only route
export const fetchUsers = (token: string): Promise<AxiosResponse<any>> =>
    apiClient.get(`/users`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });