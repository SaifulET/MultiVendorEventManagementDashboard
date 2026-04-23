import { create } from "zustand";
import { persist } from "zustand/middleware";
import { API_BASE_URL } from "../config/api";

const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isLoading: false,
      login: async ({ email, password }) => {
        set({ isLoading: true });

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/auth/admin/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          const result = await response.json();
          const accessToken = result?.data?.accessToken || result?.data?.token;

          if (!response.ok || !result?.success || !accessToken) {
            throw new Error(result?.message || "Login failed. Please try again.");
          }

          set({
            accessToken,
            user: result.data.user || null,
            isLoading: false,
          });

          return result;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      logout: () => {
        set({
          accessToken: null,
          user: null,
          isLoading: false,
        });
      },
      setUser: (user) => {
        set({ user });
      },
    }),
    {
      name: "auth-storage",
      version: 2,
      migrate: (persistedState) => {
        const state = persistedState;

        if (state?.accessToken) {
          return state;
        }

        return {
          ...state,
          accessToken: state?.token || null,
        };
      },
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    }
  )
);

export default useAuthStore;
