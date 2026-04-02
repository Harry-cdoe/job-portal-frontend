export type UserRole = "candidate" | "company" | "admin";

export type CurrentUser = {
  id: number;
  role: UserRole;
};

export type SignupRequestDto = {
  name: string;
  email: string;
  password: string;
  role?: "candidate" | "company";
};

export type SignupResponseDto = {
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
  };
};

export type LoginRequestDto = {
  email: string;
  password: string;
};

export type LoginResponseDto = {
  message?: string;
  accessToken?: string;
  user?: CurrentUser;
};

export type RefreshResponseDto = {
  accessToken: string;
};

export type MeResponseDto = {
  user: CurrentUser;
};
