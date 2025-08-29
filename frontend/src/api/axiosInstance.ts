import axios from "axios";
import useAuthStore from "../store/authStore";

const axiosInstance = axios.create({
    baseURL: import.meta.env.BASE_URL
});

// Request Interceptor: Add token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (errror) => {
        return Promise.reject(errror)
    }
);

// Response Interceptor: Handle token expiry and refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const { refreshToken, setTokens, logout } = useAuthStore.getState();

        // If 401 Unauthorized and it's not a retry request
        if (error.response.status === 401 && !originalRequest._retRY){
            originalRequest._retRY = true

            if (refreshToken) {
                try {
                    const response = await axios.post(`${import.meta.env.BASE_URL}/refresh/`, {
                        refresh: refreshToken
                    });
                    const { access } = response.data;
                    setTokens({ access, refresh: refreshToken});
                    axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                    originalRequest.headers['Authorization'] = `Bearer ${access}`;
                    return axiosInstance(originalRequest)
                } catch (refreshError) {
                    logout();
                    window.location.href = '/login';
                    return Promise.reject(refreshError)
                }
            } else {
                logout();
                window.location.href = '/login'
            }
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;