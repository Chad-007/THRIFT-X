import axios from "axios";

const api = axios.create({
  baseURL: "https://your-backend-api.com/api", // Replace with your backend API URL
  timeout: 10000,
});

export { api };
    