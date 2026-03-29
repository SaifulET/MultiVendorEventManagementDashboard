import { create } from "zustand";
import { API_BASE_URL } from "../config/api";
import useAuthStore from "./useAuthStore";

const useVenueStore = create((set) => ({
  venues: [],
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
  fetchVenues: async ({ page = 0, limit = 5 } = {}) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (!accessToken) {
      set({
        venues: [],
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

      const response = await fetch(`${API_BASE_URL}/api/v1/admin/venues?${query}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Failed to load venues.");
      }

      set({
        venues: Array.isArray(result?.data) ? result.data : [],
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
      set({
        venues: [],
        isLoading: false,
        error: error.message || "Failed to load venues.",
      });
    }
  },
}));

export default useVenueStore;
