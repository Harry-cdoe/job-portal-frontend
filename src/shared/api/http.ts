import axios from "axios";
import { env } from "@/shared/lib/env";

export const http = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
