import axios from "axios";
import Constants from "expo-constants";

// 개발 환경에서는 localhost 대신 실제 IP 주소를 사용
const API_URL = __DEV__
  ? "http://10.50.2.153:3000"
  : Constants.expoConfig?.extra?.API_URL || "http://localhost:3000";

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
    if (error.response) {
      // 서버가 응답을 반환했지만 2xx 범위를 벗어난 상태 코드
      console.error("API Error Response:", error.response.data);
    } else if (error.request) {
      // 요청은 전송되었지만 응답을 받지 못함
      console.error("API No Response:", error.request);
    } else {
      // 요청 설정 중에 오류가 발생
      console.error("API Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
