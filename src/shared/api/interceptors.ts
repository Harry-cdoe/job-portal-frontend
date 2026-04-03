import axios from "axios";
import toast from "react-hot-toast";
import { http } from "./http";
import { env } from "@/shared/lib/env";
import { useAuthStore } from "@/features/auth/store/auth.store";

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];
let sessionExpiredNotified = false;

function processQueue(token: string | null) {
  pendingQueue.forEach((cb) => cb(token));
  pendingQueue = [];
}

function redirectToLogin() {
  if (typeof window === "undefined") return;

  const nextPath = `${window.location.pathname}${window.location.search}` || "/";
  window.location.replace(`/login?next=${encodeURIComponent(nextPath)}`);
}

export function setupInterceptors() {
  const reqId = http.interceptors.request.use((config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  const resId = http.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (axios.isAxiosError(error) && !error.response && error.code !== "ERR_CANCELED") {
        toast.error("Server not reachable");
      }

      const originalRequest = error.config as { _retry?: boolean; headers: Record<string, string> };

      if (error.response?.status !== 401 || originalRequest?._retry) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push((newToken) => {
            if (!newToken) {
              reject(error);
              return;
            }
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(http(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshRes = await axios.post<{ accessToken: string }>(
          `${env.apiBaseUrl}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = refreshRes.data;
        useAuthStore.getState().setAccessToken(accessToken);
        processQueue(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return http(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearSession();
        processQueue(null);
        if (!sessionExpiredNotified) {
          sessionExpiredNotified = true;
          toast.error("Session expired");
        }
        redirectToLogin();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );

  return () => {
    sessionExpiredNotified = false;
    http.interceptors.request.eject(reqId);
    http.interceptors.response.eject(resId);
  };
}
