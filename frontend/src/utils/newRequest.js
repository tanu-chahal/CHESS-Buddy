import axios from "axios"

const newRequest = axios.create({
    // baseURL: "http://localhost:4000/api", //Uncomment this while running locally
    baseURL: `${import.meta.env.VITE_CHESSBUDDY_API}/api`, //Comment this while running locally
    withCredentials: true,
});
newRequest.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default newRequest;