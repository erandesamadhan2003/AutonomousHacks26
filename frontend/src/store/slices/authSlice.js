import { getProfile, login, logout, register, verifyToken } from "@/services/auth.service"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

const initialState = {
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
}

export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await register(userData);
        return response;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
});

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
    try {
        const response = await login(credentials);
        return response;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
    try {
        const response = await logout();
        return response;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
});

export const verifyUserToken = createAsyncThunk('auth/verifyUserToken', async (token, { rejectWithValue }) => {
    try {
        const response = await verifyToken(token);
        return response;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Token verification failed');
    }
});

export const getCurrentUser = createAsyncThunk(
    'auth/getCurrentUser',
    async (_, { rejectWithValue, getState }) => {
        try {
            const state = getState();

            // If user already exists and is authenticated, return it
            if (state.auth.user && state.auth.isAuthenticated) {
                return { user: state.auth.user };
            }

            // If already loading, skip the request
            if (state.auth.loading) {
                return rejectWithValue('Already loading user data');
            }

            const response = await getProfile();
            return response;
        } catch (error) {
            if (error.response?.status === 429) {
                return rejectWithValue('Too many requests. Please wait a moment.');
            }

            // Don't throw error for unauthorized - just clear auth
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                return rejectWithValue('Session expired. Please login again.');
            }

            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to get user profile');
        }
    },
    {
        // Prevent duplicate concurrent requests
        condition: (_, { getState }) => {
            const { auth } = getState();
            // Don't run if already loading or if user exists
            if (auth.loading || (auth.user && auth.isAuthenticated)) {
                return false;
            }
            return true;
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.error = null;

            if (action.payload.token) {
                localStorage.setItem('token', action.payload.token);
            }
        },
        clearCredentials: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem('token');
        },
        setToken: (state, action) => {
            state.token = action.payload;

            if (action.payload) {
                localStorage.setItem('token', action.payload);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Register User
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                if (action.payload.token) {
                    localStorage.setItem('token', action.payload.token);
                }
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Login User
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                if (action.payload.token) {
                    localStorage.setItem('token', action.payload.token);
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Verify Token
            .addCase(verifyUserToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyUserToken.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                // Keep the token that was already set
                state.token = state.token || localStorage.getItem('token');
            })
            .addCase(verifyUserToken.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.error = action.payload;
                localStorage.removeItem('token');
            })
            // Get Current User
            .addCase(getCurrentUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.loading = false;

                // Only clear auth on session expired or unauthorized
                if (action.payload?.includes('Session expired') || action.payload?.includes('unauthorized')) {
                    state.isAuthenticated = false;
                    state.user = null;
                    state.token = null;
                    localStorage.removeItem('token');
                }

                // Don't set error for "already loading" or rate limits
                if (!action.payload?.includes('Already loading') && !action.payload?.includes('Too many requests')) {
                    state.error = action.payload;
                }
            })
            // Logout User
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                localStorage.removeItem('token');
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.error = action.payload;
                localStorage.removeItem('token');
            });
    }
});

export const { clearError, setCredentials, clearCredentials, setToken } = authSlice.actions;
export default authSlice.reducer;