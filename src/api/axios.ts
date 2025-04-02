import axios from "axios";

// Vercel URL로 직접 설정
const API_URL = "https://kale-weather-forecast-backend.vercel.app";

console.log("API_URL:", API_URL);

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data) {
      return Promise.reject(
        new Error(error.response.data.message || "서버 오류가 발생했습니다.")
      );
    }
    if (error.request) {
      return Promise.reject(new Error("서버에 연결할 수 없습니다."));
    }
    return Promise.reject(error);
  }
);

export default api;
