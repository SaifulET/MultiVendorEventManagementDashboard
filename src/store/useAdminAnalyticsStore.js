import { create } from "zustand";
import { API_BASE_URL } from "../config/api";
import useAuthStore from "./useAuthStore";

const EMPTY_OVERVIEW = {
  totalClients: 0,
  totalVenueProviders: 0,
  totalServiceProviders: 0,
  totalRevenue: 0,
};

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const EMPTY_MONTHLY_USERS = MONTH_LABELS.map((month) => ({
  month,
  users: 0,
}));

const ROLE_TO_USER_TYPE = {
  customer: "clients",
  client: "clients",
  service_provider: "service",
  service: "service",
  venue_provider: "venue",
  venue: "venue",
};

const getAuthHeader = () => {
  const accessToken = useAuthStore.getState().accessToken;

  if (!accessToken) {
    throw new Error("You need to sign in first.");
  }

  return `Bearer ${accessToken}`;
};

const fetchAdminResource = async (path) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/${path}`, {
    headers: {
      Authorization: getAuthHeader(),
    },
  });

  const result = await response.json();

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Failed to load analytics.");
  }

  return result?.data || {};
};

const fetchAdminAnalytics = (path) => fetchAdminResource(`analytics/${path}`);

const normalizeMonthlyUsers = (monthly) => {
  const usersByMonth = new Map(
    (Array.isArray(monthly) ? monthly : []).map((item) => [
      Number(item?.month),
      Number(item?.totalNewUsers) || 0,
    ])
  );

  return EMPTY_MONTHLY_USERS.map((item, index) => ({
    ...item,
    users: usersByMonth.get(index + 1) ?? 0,
  }));
};

const formatDate = (value) => {
  if (!value) {
    return "Unavailable";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatRoleLabel = (role) => {
  if (!role) {
    return "User";
  }

  return role
    .split(/[_-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const normalizeRecentUsers = (users) =>
  (Array.isArray(users) ? users : []).map((user) => ({
    id: user?._id,
    name: user?.fullName || user?.name || "Unknown User",
    email: user?.email || "No email provided",
    joinedDate: formatDate(user?.registeredAt || user?.createdAt || user?.updatedAt),
    avatar: user?.profileImage || "",
    role: user?.role || "",
    roleLabel: formatRoleLabel(user?.role),
    userType: ROLE_TO_USER_TYPE[user?.role] || "",
    isBlocked: Boolean(user?.isBlocked),
  }));

const useAdminAnalyticsStore = create((set) => ({
  overview: EMPTY_OVERVIEW,
  monthlyUsers: EMPTY_MONTHLY_USERS,
  recentUsers: [],
  isOverviewLoading: false,
  isYearlyLoading: false,
  isRecentUsersLoading: false,
  overviewError: null,
  yearlyError: null,
  recentUsersError: null,
  fetchOverview: async () => {
    set({ isOverviewLoading: true, overviewError: null });

    try {
      const data = await fetchAdminAnalytics("overview");
      const users = data?.users || {};
      const revenue = data?.revenue || {};

      set({
        overview: {
          totalClients: Number(users.totalCustomers) || 0,
          totalVenueProviders: Number(users.totalVenueProviders) || 0,
          totalServiceProviders: Number(users.totalServiceProviders) || 0,
          totalRevenue: Number(revenue.totalRevenue) || 0,
        },
        isOverviewLoading: false,
        overviewError: null,
      });
    } catch (error) {
      set({
        overview: EMPTY_OVERVIEW,
        isOverviewLoading: false,
        overviewError: error.message || "Failed to load overview.",
      });
    }
  },
  fetchYearly: async (year) => {
    set({ isYearlyLoading: true, yearlyError: null });

    try {
      const data = await fetchAdminAnalytics(`yearly?year=${encodeURIComponent(year)}`);

      set({
        monthlyUsers: normalizeMonthlyUsers(data?.monthly),
        isYearlyLoading: false,
        yearlyError: null,
      });
    } catch (error) {
      set({
        monthlyUsers: EMPTY_MONTHLY_USERS,
        isYearlyLoading: false,
        yearlyError: error.message || "Failed to load yearly analytics.",
      });
    }
  },
  fetchRecentUsers: async () => {
    set({ isRecentUsersLoading: true, recentUsersError: null });

    try {
      const data = await fetchAdminResource("recent-registered-users");

      set({
        recentUsers: normalizeRecentUsers(data),
        isRecentUsersLoading: false,
        recentUsersError: null,
      });
    } catch (error) {
      set({
        recentUsers: [],
        isRecentUsersLoading: false,
        recentUsersError: error.message || "Failed to load recent users.",
      });
    }
  },
}));

export default useAdminAnalyticsStore;
