import axios from "axios";

const rawBaseURL = process.env.REACT_APP_API_URL || "https://emergency-backend-77rt.onrender.com";
const baseURL = rawBaseURL.endsWith("/api") ? rawBaseURL : `${rawBaseURL.replace(/\/$/, "")}/api`;

const API = axios.create({
  baseURL
});

API.interceptors.request.use((req) => {

const token = localStorage.getItem("token");

if (token) {
req.headers.Authorization = `Bearer ${token}`;
}

return req;
});

export default API;