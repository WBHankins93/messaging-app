import apiClient from "./api";
import { saveToken, clearToken } from "../utils/sessionStorage";

export const login = async (username: string, password: string): Promise<void> => {
    try {
        const response = await apiClient.post("/token", new URLSearchParams({ username, password }));
        const { access_token, refresh_token } = response.data;

        // Save tokens to session storage
        saveToken("accessToken", access_token);
        saveToken("refreshToken", refresh_token);
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

export const logout = (): void => {
    clearToken("accessToken");
    clearToken("refreshToken");
};
