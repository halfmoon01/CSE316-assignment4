import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // 서버의 URL
  withCredentials: true, // 쿠키 포함
});

// 요청 인터셉터
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response, // 정상적인 응답 처리
  async (error) => {
    const originalRequest = error.config;

    // 토큰 만료(401) 처리
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post("/refresh", {}, { withCredentials: true });

        if (refreshResponse.status === 200) {
          const { accessToken } = refreshResponse.data;
          localStorage.setItem("accessToken", accessToken);

          // 갱신된 토큰으로 요청 재시도
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refresh token expired or invalid:", refreshError);
        localStorage.removeItem("accessToken");
        window.location.href = "/sign-in"; // 로그인 페이지로 리다이렉트
      }
    }

    return Promise.reject(error); // 다른 에러는 그대로 전달
  }
);

export default api;
