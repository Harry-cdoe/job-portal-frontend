import { http } from "@/shared/api/http";
import type {
  LoginRequestDto,
  LoginResponseDto,
  MeResponseDto,
  RefreshResponseDto,
  SignupRequestDto,
  SignupResponseDto,
} from "../types";

export async function signup(payload: SignupRequestDto) {
  const { data } = await http.post<SignupResponseDto>("/auth/signup", payload);
  return data;
}

export async function login(payload: LoginRequestDto) {
  const { data } = await http.post<LoginResponseDto>("/auth/login", payload);
  return data;
}

export async function logout() {
  const { data } = await http.post<{ message: string }>("/auth/logout");
  return data;
}

export async function me() {
  const { data } = await http.get<MeResponseDto>("/auth/me");
  return data.user;
}

export async function refresh() {
  const { data } = await http.post<RefreshResponseDto>("/auth/refresh", {});
  return data;
}
