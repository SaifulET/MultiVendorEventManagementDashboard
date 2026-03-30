import { create } from "zustand";
import { API_BASE_URL } from "../config/api";
import useAuthStore from "./useAuthStore";

export const ADMIN_USER_ENDPOINTS = {
  clients: "customers",
  service: "service-providers",
  venue: "venue-providers",
};

const DEFAULT_META = {
  page: 1,
  limit: 8,
  total: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

const getAuthHeader = () => {
  const accessToken = useAuthStore.getState().accessToken;

  if (!accessToken) {
    throw new Error("You need to sign in first.");
  }

  return `Bearer ${accessToken}`;
};

const buildQuery = ({ page, limit }) => {
  const query = new URLSearchParams();

  if (page !== undefined) {
    query.set("page", String(page));
  }

  if (limit !== undefined) {
    query.set("limit", String(limit));
  }

  return query.toString();
};

const fetchAdminResource = async ({ endpoint, method = "GET", body, queryParams }) => {
  const query = queryParams ? buildQuery(queryParams) : "";
  const requestUrl = `${API_BASE_URL}/api/v1/admin/${endpoint}${query ? `?${query}` : ""}`;
  const bearerToken = getAuthHeader();

  console.log("[adminUsers] Request URL:", requestUrl);
  console.log("[adminUsers] Authorization header:", bearerToken);

  const response = await fetch(requestUrl, {
    method,
    headers: {
      Authorization: bearerToken,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const result = await response.json();

  console.log("[adminUsers] Response status:", response.status);
  console.log("[adminUsers] Response payload:", result);

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Request failed.");
  }

  return result;
};

const useAdminUserStore = create((set) => ({
  users: [],
  meta: DEFAULT_META,
  isLoading: false,
  error: null,
  blockedUsers: [],
  blockedMeta: DEFAULT_META,
  isBlockedLoading: false,
  blockedError: null,
  fetchUsers: async ({ userType, page = 1, limit = 8 } = {}) => {
    const endpoint = ADMIN_USER_ENDPOINTS[userType];

    if (!endpoint) {
      set({ users: [], meta: DEFAULT_META, error: "Unsupported user type.", isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const result = await fetchAdminResource({
        endpoint,
        queryParams: { page, limit },
      });

      set({
        users: Array.isArray(result?.data) ? result.data : [],
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
      console.error("[adminUsers] fetchUsers failed:", error);
      set({
        users: [],
        meta: DEFAULT_META,
        isLoading: false,
        error: error.message || "Failed to load users.",
      });
    }
  },
  fetchBlockedUsers: async ({ userType, page = 1, limit = 8 } = {}) => {
    const endpoint = ADMIN_USER_ENDPOINTS[userType];

    if (!endpoint) {
      set({
        blockedUsers: [],
        blockedMeta: DEFAULT_META,
        blockedError: "Unsupported user type.",
        isBlockedLoading: false,
      });
      return;
    }

    set({ isBlockedLoading: true, blockedError: null });

    try {
      const result = await fetchAdminResource({
        endpoint: `${endpoint}/blocked`,
        queryParams: { page, limit },
      });

      set({
        blockedUsers: Array.isArray(result?.data) ? result.data : [],
        blockedMeta: {
          page: result?.meta?.page ?? page,
          limit: result?.meta?.limit ?? limit,
          total: result?.meta?.total ?? 0,
          totalPages: result?.meta?.totalPages ?? 1,
          hasNextPage: Boolean(result?.meta?.hasNextPage),
          hasPrevPage: Boolean(result?.meta?.hasPrevPage),
        },
        isBlockedLoading: false,
        blockedError: null,
      });
    } catch (error) {
      console.error("[adminUsers] fetchBlockedUsers failed:", error);
      set({
        blockedUsers: [],
        blockedMeta: DEFAULT_META,
        isBlockedLoading: false,
        blockedError: error.message || "Failed to load blocked users.",
      });
    }
  },
  fetchUserDetails: async ({ userType, userId }) => {
    const endpoint = ADMIN_USER_ENDPOINTS[userType];

    if (!endpoint || !userId) {
      throw new Error("User details request is missing required information.");
    }

    const result = await fetchAdminResource({
      endpoint: `${endpoint}/${userId}`,
    });

    return result?.data || null;
  },
  updateUserStatus: async ({ userType, userId, action }) => {
    const endpoint = ADMIN_USER_ENDPOINTS[userType];

    if (!endpoint || !userId || !action) {
      throw new Error("User action request is missing required information.");
    }

    return fetchAdminResource({
      endpoint: `${endpoint}/${userId}/${action}`,
      method: "PATCH",
    });
  },
}));

export default useAdminUserStore;
