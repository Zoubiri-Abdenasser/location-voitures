import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// إرفاق توكن الأدمن تلقائيًا في كل طلب إذا كان موجودًا
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// عند انتهاء صلاحية التوكن، نُخرج الأدمن تلقائيًا
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_info");
    }
    return Promise.reject(error);
  }
);