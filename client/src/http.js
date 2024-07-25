import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    let accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
}, function (error) {
    // Do something with response error
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.clear();
        window.location = '/login';
    }
    return Promise.reject(error);
});

// Fetch users
export const fetchUsers = async () => {
    try {
        const response = await instance.get('/user/users');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default instance;
