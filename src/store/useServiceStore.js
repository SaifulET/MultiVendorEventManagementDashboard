import { create } from "zustand";
import { API_BASE_URL } from "../config/api";
import useAuthStore from "./useAuthStore";

const useServiceStore = create((set) => ({
  services: [],
  meta: {
    page: 0,
    limit: 5,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  },
  isLoading: false,
  error: null,
  fetchServices: async ({ page = 1, limit = 5 } = {}) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (!accessToken) {
      set({
        services: [],
        error: "You need to sign in first.",
        isLoading: false,
      });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      const requestUrl = `${API_BASE_URL}/api/v1/admin/services?${query}`;
      const bearerToken = `Bearer ${accessToken}`;

      console.log("[fetchServices] Request URL:", requestUrl);
      console.log("[fetchServices] Authorization header:", bearerToken);

      const response = await fetch(requestUrl, {
        headers: {
          Authorization: bearerToken,
        },
      });

      const result = await response.json();

      console.log("[fetchServices] Response status:", response.status);
      console.log("[fetchServices] Response payload:", result);

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Failed to load services.");
      }

      set({
        services: Array.isArray(result?.data) ? result.data : [],
        meta: {
          page: result?.meta?.page ?? page,
          limit: result?.meta?.limit ?? limit,
          total: result?.meta?.total ?? 0,
          totalPages: result?.meta?.totalPages ?? 1,
          hasNextPage: Boolean(result?.meta?.hasNextPage),
          hasPrevPage: Boolean(result?.meta?.hasPrevPage),
        },
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("[fetchServices] Request failed:", error);
      set({
        services: [],
        isLoading: false,
        error: error.message || "Failed to load services.",
      });
    }
  },
}));

export default useServiceStore;
