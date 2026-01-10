import { googleLogin } from "@/services/auth.service";
import { clearError, getCurrentUser, loginUser, logoutUser, registerUser, setCredentials, verifyUserToken } from "@/store/slices/authSlice";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router";

export const useAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const hasCheckedAuth = useRef(false);
    const isCheckingAuth = useRef(false);

    const { user, token, loading, error, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');

        // Only fetch if:
        // 1. We have a token
        // 2. No user data
        // 3. Haven't checked yet
        // 4. Not currently checking
        // 5. Not already authenticated
        if (storedToken && !user && !hasCheckedAuth.current && !isCheckingAuth.current && !isAuthenticated) {
            hasCheckedAuth.current = true;
            isCheckingAuth.current = true;

            dispatch(getCurrentUser())
                .finally(() => {
                    isCheckingAuth.current = false;
                });
        }
    }, [dispatch]); // Remove user from dependencies to prevent loops

    const register = async (userData) => {
        try {
            const result = await dispatch(registerUser(userData)).unwrap();
            hasCheckedAuth.current = true;
            navigate('/dashboard');
            return result;
        } catch (err) {
            console.error('Registration error:', err);
            throw err;
        }
    }

    const login = async (credentials) => {
        try {
            const result = await dispatch(loginUser(credentials)).unwrap();
            hasCheckedAuth.current = true;
            navigate('/dashboard');
            return result;
        } catch (err) {
            console.error('Login error:', err);
            throw err;
        }
    }

    const logout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            hasCheckedAuth.current = false;
            isCheckingAuth.current = false;
            navigate('/login');
        } catch (err) {
            console.error('Logout error:', err);
            hasCheckedAuth.current = false;
            isCheckingAuth.current = false;
            navigate('/login');
        }
    }

    const googleLoginHandler = () => {
        googleLogin();
    }

    const verifyAuthToken = async (token) => {
        try {
            localStorage.setItem('token', token);

            const result = await dispatch(verifyUserToken(token)).unwrap();
            hasCheckedAuth.current = true;

            dispatch(setCredentials({
                user: result.user,
                token: token
            }));

            setTimeout(() => {
                navigate('/dashboard');
            }, 100);

            return result;
        } catch (err) {
            navigate('/login');
            console.error('Token verification error:', err);
            throw err;
        }
    }

    const fetchCurrentUser = async () => {
        if (isCheckingAuth.current) {
            console.warn('Already fetching user data');
            return null;
        }

        try {
            isCheckingAuth.current = true;
            const result = await dispatch(getCurrentUser()).unwrap();
            return result;
        } catch (err) {
            console.error('Fetch current user error:', err);
            throw err;
        } finally {
            isCheckingAuth.current = false;
        }
    }

    const clearAuthError = () => {
        dispatch(clearError())
    }

    return {
        user,
        token,
        loading,
        error,
        isAuthenticated,

        register,
        login,
        logout,
        googleLoginHandler,
        verifyAuthToken,
        fetchCurrentUser,
        clearAuthError
    }
}