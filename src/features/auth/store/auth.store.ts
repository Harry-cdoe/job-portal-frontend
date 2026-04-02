import { create } from "zustand";
import type { CurrentUser } from "../types";

type AuthState = {
  accessToken: string | null;
  user: CurrentUser | null;
  isHydrating: boolean;
  setAccessToken: (token: string | null) => void;
  setUser: (user: CurrentUser | null) => void;
  setSession: (token: string, user: CurrentUser) => void;
  clearSession: () => void;
  setHydrating: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  isHydrating: true,
  setAccessToken: (accessToken) => {
    if (get().accessToken === accessToken) return;
    set({ accessToken });
  },
  setUser: (user) => {
    const prev = get().user;
    if (prev?.id === user?.id && prev?.role === user?.role) return;
    set({ user });
  },
  setSession: (accessToken, user) => {
    const state = get();
    if (state.accessToken === accessToken && state.user?.id === user.id && state.user?.role === user.role) return;
    set({ accessToken, user });
  },
  clearSession: () => {
    const state = get();
    if (!state.accessToken && !state.user) return;
    set({ accessToken: null, user: null });
  },
  setHydrating: (isHydrating) => {
    if (get().isHydrating === isHydrating) return;
    set({ isHydrating });
  },
}));
