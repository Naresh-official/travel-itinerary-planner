import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:3000/api",
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("authToken");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem("authToken");
			window.location.href = "/login";
		} else if (error.response?.status === 500) {
			console.error("Server error:", error.response.data);
		}
		return Promise.reject(error);
	}
);

export default api;
