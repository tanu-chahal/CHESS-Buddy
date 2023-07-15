import axios from "axios"

const newRequest = axios.create({
    baseURL: "http://localhost:4000/api",
    withCredentials: true,
});

export default newRequest;