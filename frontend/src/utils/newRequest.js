import axios from "axios"

const newRequest = axios.create({
    // baseURL: "http://localhost:4000/api", //Uncomment this while running locally
    baseURL: "https://chessbuddy.onrender.com/api", //Comment this while running locally
    withCredentials: true,
});

export default newRequest;