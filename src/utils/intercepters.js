import axios from "axios";
import { showErrorToast } from "./toastNotifications";

// Create an Axios instance for open requests
const OpenAxios = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Create an Axios instance for authenticated requests
const Axios = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
  // timeout: 1000,
});

const addTokenToHeaders = (config) => {
  // Retrieve token from localStorage
  const token = localStorage.getItem("token");

  if (token) {
    // Add Authorization header with Bearer token
    config.headers?.set("Authorization", `Bearer ${token}`);
  }


  return config;
};

// Interceptor to add token
Axios.interceptors.request.use(
  (config) => addTokenToHeaders(config),
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 500 ||
        error.response.status === 400 ||
        error.response.status === 405)
    ) {
      showErrorToast(
        error.response.data.message ||
          error.response.data.error ||
          "Something went wrong"
      );
    } else if (error.response && error.response.status === 401) {
      localStorage.clear();
      window.location.href = "/";
    }
  }
);

OpenAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(
      error.response &&
        (error.response.status === 500 || error.response.status === 400)
    );

    if (error.response && (error.status === 500 || error.status === 400)) {
      showErrorToast(error.response.data.message || "Something went wrong");
    }
  }
);

export { OpenAxios, Axios };
