import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_INTERNAL_API_PATH,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const register = async (data) => {
  try {
    const response = await api.post("/api/auth/register", data);
    return response;
  } catch (error) {
    throw error;
  }
};
export const login = async (data) => {
  try {
    const response = await api.post("/api/auth/login", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getTasks = async (params = {}) => {
  try {
    const response = await api.get("/api/task", { params });
    return response;
  } catch (error) {
    throw error;
  }
};
export const createTask = async (data) => {
  try {
    const response = await api.post("/api/task", data);
    return response;
  } catch (error) {
    throw error;
  }
};
// Update
export const updateTask = async (id, data) => {
  try {
    const response = api.put(`/api/task/${id}`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getTaskById = async (id) => {
  try {
    const response = await api.get(`/api/task/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Delete
export const deleteTask = async (id) => {
  try {
    const response = await api.delete(`/api/task/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.get("/api/auth/logout");
    return response;
  } catch (error) {
    throw error;
  }
};

// auto token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalReq = error.config;

    if (error.response?.status === 401 && !originalReq._isRetry) {
      originalReq._isRetry = true;
      try {
        await api.get("/api/auth/refresh");
        return api.request(originalReq);
      } catch (err) {
        await api.get("/api/auth/logout");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
