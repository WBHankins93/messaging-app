// Check if sessionStorage is available
const isBrowser = typeof window !== "undefined";

// Save token to session storage
export const saveToken = (key: string, token: string): void => {
    if (isBrowser) {
        sessionStorage.setItem(key, token);
    }
};

// Retrieve token from session storage
export const getToken = (key: string): string | null => {
    if (isBrowser) {
        return sessionStorage.getItem(key);
    }
    return null;
};

// Remove token from session storage
export const clearToken = (key: string): void => {
    if (isBrowser) {
        sessionStorage.removeItem(key);
    }
};
