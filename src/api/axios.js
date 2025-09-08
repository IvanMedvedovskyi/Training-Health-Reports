import axios from "axios";

export const http = axios.create({
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
  },
  withCredentials: true,
});

http.interceptors.response.use(
  (r) => r,
  (err) => {
    const message = err?.response
      ? `HTTP ${err.response.status} ${err.response.statusText}`
      : err?.message || "Network error";
    return Promise.reject(new Error(message));
  }
);
