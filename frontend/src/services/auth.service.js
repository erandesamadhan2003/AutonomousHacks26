import { api, AUTH_URL, BASE_URL } from "../api/api";

// Track last request time to prevent rapid calls
let lastProfileFetch = 0;
const PROFILE_FETCH_COOLDOWN = 2000; // 2 seconds

export const register = async (userData) => {
    try {
        const response = await api.post(AUTH_URL.REGISTER, userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
}

export const login = async (credentials) => {
    try {
        const response = await api.post(AUTH_URL.LOGIN, credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
}

export const googleLogin = () => {
    window.location.href = BASE_URL + AUTH_URL.GOOGLE_AUTH;
}

export const logout = async () => {
    try {
        const response = await api.post(AUTH_URL.LOGOUT);
        localStorage.removeItem('token');
        return response.data;
    } catch (error) {
        console.error("Logout error:", error);
        localStorage.removeItem('token');
        throw error;
    }
}

export const getProfile = async (retryCount = 0) => {
    try {
        // Prevent rapid successive calls
        const now = Date.now();
        if (now - lastProfileFetch < PROFILE_FETCH_COOLDOWN) {
            throw new Error('Please wait before fetching profile again');
        }

        lastProfileFetch = now;
        const response = await api.get(AUTH_URL.GET_PROFILE);
        return response.data;
    } catch (error) {
        // Handle rate limiting with exponential backoff
        if (error.response?.status === 429 && retryCount < 2) {
            const waitTime = Math.pow(2, retryCount) * 1000; // 1s, 2s
            console.log(`Rate limited. Retrying in ${waitTime}ms...`);

            await new Promise(resolve => setTimeout(resolve, waitTime));
            return getProfile(retryCount + 1);
        }

        if (error.response?.status === 429) {
            console.error("Rate limit exceeded after retries.");
            throw new Error("Server is busy. Please try again in a moment.");
        }

        console.error("Get profile error:", error);
        throw error;
    }
}

export const verifyToken = async (token) => {
    try {
        localStorage.setItem('token', token);
        const response = await getProfile();
        return response;
    } catch (error) {
        console.error("Token verification error:", error);

        // Only remove token on auth errors, not rate limits
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('token');
        }

        throw error;
    }
}
