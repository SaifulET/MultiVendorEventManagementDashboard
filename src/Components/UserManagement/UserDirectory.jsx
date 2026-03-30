import React, { useEffect, useMemo, useState } from "react";
import { Ban, ChevronLeft, ChevronRight, Eye, Search, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { VscDebugRestart } from "react-icons/vsc";
import useAdminUserStore from "../../store/useAdminUserStore";

const TAB_OPTIONS = [
  { id: "clients", label: "Clients", userTypeLabel: "Customer" },
  { id: "service", label: "Service Provider", userTypeLabel: "Service Provider" },
  { id: "venue", label: "Venue Provider", userTypeLabel: "Venue Provider" },
];

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

const getInitials = (name) => {
  if (!name) {
    return "NA";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const normalizeDirectoryRow = (user, userType) => ({
  id: user?._id,
  name: user?.fullName || user?.name || "Unknown User",
  email: user?.email || "No email provided",
  joinedDate: formatDate(user?.createdAt || user?.updatedAt),
  userType,
  isBlocked: Boolean(user?.isBlocked),
  isEmailVerified: Boolean(user?.isEmailVerified),
  role: user?.role || userType,
  serviceCategories: Array.isArray(user?.serviceCategories) ? user.serviceCategories : [],
  raw: user,
});

const getProviderBusiness = (user) =>
  user?.onboarding?.serviceProvider ||
  user?.onboarding?.venueProvider ||
  user?.provider?.serviceProvider ||
  user?.provider?.venueProvider ||
  {};

const renderInfoRow = (label, value) => (
  <div className="flex justify-between gap-4">
    <span className="font-medium text-gray-700">{label}</span>
    <span className="text-right text-gray-900 break-all">{value || "Unavailable"}</span>
  </div>
);

const UserDirectory = ({ mode = "active" }) => {
  const isBlockedMode = mode === "blocked";
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromQuery = searchParams.get("tab");
  const initialTab = TAB_OPTIONS.some((tab) => tab.id === tabFromQuery) ? tabFromQuery : "clients";

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [detailError, setDetailError] = useState("");
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToAction, setUserToAction] = useState(null);
  const [actionError, setActionError] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);
  const usersPerPage = 8;

  const users = useAdminUserStore((state) => state.users);
  const meta = useAdminUserStore((state) => state.meta);
  const isLoading = useAdminUserStore((state) => state.isLoading);
  const error = useAdminUserStore((state) => state.error);
  const blockedUsers = useAdminUserStore((state) => state.blockedUsers);
  const blockedMeta = useAdminUserStore((state) => state.blockedMeta);
  const isBlockedLoading = useAdminUserStore((state) => state.isBlockedLoading);
  const blockedError = useAdminUserStore((state) => state.blockedError);
  const fetchUsers = useAdminUserStore((state) => state.fetchUsers);
  const fetchBlockedUsers = useAdminUserStore((state) => state.fetchBlockedUsers);
  const fetchUserDetails = useAdminUserStore((state) => state.fetchUserDetails);
  const updateUserStatus = useAdminUserStore((state) => state.updateUserStatus);

  const currentTabConfig =
    TAB_OPTIONS.find((tab) => tab.id === activeTab) || TAB_OPTIONS[0];
  const currentData = isBlockedMode ? blockedUsers : users;
  const currentMeta = isBlockedMode ? blockedMeta : meta;
  const currentLoading = isBlockedMode ? isBlockedLoading : isLoading;
  const currentError = isBlockedMode ? blockedError : error;
  const currentRows = useMemo(
    () => currentData.map((user) => normalizeDirectoryRow(user, activeTab)),
    [activeTab, currentData]
  );

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return currentRows;
    }

    return currentRows.filter(
      (user) =>
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch)
    );
  }, [currentRows, searchTerm]);

  useEffect(() => {
    setSearchParams({ tab: activeTab }, { replace: true });
  }, [activeTab, setSearchParams]);

  useEffect(() => {
    if (isBlockedMode) {
      fetchBlockedUsers({ userType: activeTab, page: currentPage, limit: usersPerPage });
      return;
    }

    fetchUsers({ userType: activeTab, page: currentPage, limit: usersPerPage });
  }, [activeTab, currentPage, fetchBlockedUsers, fetchUsers, isBlockedMode]);

  const totalPages = Math.max(currentMeta?.totalPages || 1, 1);
  const startIndex = ((currentMeta?.page || currentPage) - 1) * (currentMeta?.limit || usersPerPage);
  const totalItems = currentMeta?.total || 0;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchTerm("");
  };

  const handleViewUser = async (user) => {
    setSelectedUser(user);
    setSelectedUserDetails(null);
    setDetailError("");
    setIsDetailLoading(true);
    setIsDetailModalOpen(true);

    try {
      const details = await fetchUserDetails({ userType: activeTab, userId: user.id });
      setSelectedUserDetails(details);
    } catch (detailsError) {
      console.error("[userDirectory] fetchUserDetails failed:", detailsError);
      setDetailError(detailsError.message || "Failed to load user details.");
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedUser(null);
    setSelectedUserDetails(null);
    setDetailError("");
  };

  const handleOpenActionModal = (user) => {
    setActionError("");
    setUserToAction(user);
    setIsConfirmModalOpen(true);
  };

  const handleCloseActionModal = () => {
    setIsConfirmModalOpen(false);
    setUserToAction(null);
    setActionError("");
  };

  const refreshCurrentList = async () => {
    if (isBlockedMode) {
      await fetchBlockedUsers({ userType: activeTab, page: currentPage, limit: usersPerPage });
      return;
    }

    await fetchUsers({ userType: activeTab, page: currentPage, limit: usersPerPage });
  };

  const handleConfirmAction = async () => {
    if (!userToAction?.id) {
      return;
    }

    setActionError("");
    setIsActionLoading(true);

    try {
      await updateUserStatus({
        userType: activeTab,
        userId: userToAction.id,
        action: isBlockedMode ? "unblock" : "block",
      });

      handleCloseActionModal();
      handleCloseModal();
      await refreshCurrentList();
    } catch (statusError) {
      console.error("[userDirectory] updateUserStatus failed:", statusError);
      setActionError(statusError.message || "Action failed.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const renderPaginationNumbers = () => {
    const pages = [];
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    for (
      let page = Math.max(2, currentPage - 1);
      page <= Math.min(totalPages - 1, currentPage + 1);
      page += 1
    ) {
      if (!pages.includes(page)) {
        pages.push(page);
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  const detailUser = selectedUserDetails || selectedUser?.raw || {};
  const providerBusiness = getProviderBusiness(detailUser);
  const subscription = detailUser?.subscription || {};
  const payment = subscription?.payment || {};
  const detailCategories = Array.isArray(detailUser?.serviceCategories)
    ? detailUser.serviceCategories
    : [];

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="border border-gray-200 mx-auto mt-16">
        <div className="px-6 py-4 mb-6 rounded-tl-lg rounded-tr-lg bg-[#B74140]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h1 className="text-2xl font-semibold text-white">
              {isBlockedMode ? "Blocked List" : "User List"}
            </h1>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  placeholder="Search User"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full sm:w-64 py-2 pl-10 pr-4 text-sm bg-white border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-300"
                />
              </div>

              {!isBlockedMode && (
                <Link to={`/block-list?tab=${activeTab}`}>
                  <button className="px-4 py-2 text-sm font-medium bg-white rounded-lg text-[#B74140] hover:bg-gray-50">
                    Blocked Users
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 mb-6">
          <div className="flex gap-3 flex-wrap">
            {TAB_OPTIONS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded border ${
                  activeTab === tab.id
                    ? "bg-[#B74140] text-white border-[#B74140]"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-[#B74140] uppercase">
                    S.ID
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-[#B74140] uppercase">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-[#B74140] uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-[#B74140] uppercase">
                    Joined Date
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-[#B74140] uppercase">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {currentLoading && (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                      {isBlockedMode ? "Loading blocked users..." : "Loading users..."}
                    </td>
                  </tr>
                )}

                {!currentLoading && currentError && (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-red-500">
                      {currentError}
                    </td>
                  </tr>
                )}

                {!currentLoading && !currentError && filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                      {isBlockedMode
                        ? "No blocked users found for this tab."
                        : "No users found for this tab."}
                    </td>
                  </tr>
                )}

                {!currentLoading &&
                  !currentError &&
                  filteredUsers.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {String(startIndex + index + 1).padStart(2, "0")}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-[#F3D7D7] text-[#B74140] flex items-center justify-center text-xs font-semibold">
                            {getInitials(user.name)}
                          </div>
                          <span className="ml-3 text-sm font-medium text-gray-900">
                            {user.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {user.email}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {user.joinedDate}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenActionModal(user)}
                            className={`p-1 rounded-full ${
                              isBlockedMode
                                ? "text-[#B74140] hover:bg-red-50"
                                : "text-red-500 hover:bg-red-50"
                            }`}
                          >
                            {isBlockedMode ? (
                              <VscDebugRestart className="w-4 h-4" />
                            ) : (
                              <Ban className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleViewUser(user)}
                            className="flex items-center gap-1 p-1 text-[#B74140] rounded-full hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <span className="text-sm text-gray-700">
              SHOWING {filteredUsers.length ? startIndex + 1 : 0}-
              {Math.min(startIndex + filteredUsers.length, totalItems)} OF {totalItems}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || currentLoading}
                className="p-2 text-gray-400 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {renderPaginationNumbers().map((page, index) => (
                <button
                  key={`${page}-${index}`}
                  onClick={() => typeof page === "number" && handlePageChange(page)}
                  disabled={page === "..." || currentLoading}
                  className={`min-w-[32px] rounded-lg px-3 py-1 text-sm ${
                    page === currentPage
                      ? "bg-[#B74140] text-white"
                      : page === "..."
                      ? "text-gray-400 cursor-default"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages || currentLoading}
                className="p-2 text-gray-400 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isDetailModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="flex-1 text-2xl font-semibold text-center text-[#B74140]">
                {`${currentTabConfig.userTypeLabel} Details`}
              </h2>
              <button onClick={handleCloseModal} className="ml-4 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center text-gray-500 text-sm pt-2 px-6">
              {`See all details about ${selectedUser.name}`}
            </div>

            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 mr-4 rounded-full bg-[#F3D7D7] text-[#B74140] flex items-center justify-center text-xl font-semibold">
                  {getInitials(selectedUser.name)}
                </div>
                <h3 className="text-xl font-medium text-[#B74140]">{selectedUser.name}</h3>
              </div>

              {isDetailLoading && <p className="text-center text-gray-500">Loading details...</p>}
              {!isDetailLoading && detailError && (
                <p className="text-center text-red-500">{detailError}</p>
              )}

              {!isDetailLoading && !detailError && (
                <div className="space-y-4">
                  {renderInfoRow("Name", detailUser?.fullName || detailUser?.name || selectedUser.name)}
                  {renderInfoRow("Email", detailUser?.email || selectedUser.email)}
                  {renderInfoRow("Joining Date", formatDate(detailUser?.createdAt || detailUser?.updatedAt))}
                  {renderInfoRow("User Type", currentTabConfig.userTypeLabel)}
                  {renderInfoRow("Email Verified", detailUser?.isEmailVerified ? "Yes" : "No")}
                  {renderInfoRow("Account Status", detailUser?.isBlocked ? "Blocked" : "Active")}

                  {subscription?.plan ? renderInfoRow("Plan", subscription.plan) : null}
                  {subscription?.status ? renderInfoRow("Subscription", subscription.status) : null}
                  {payment?.billingCycle ? renderInfoRow("Billing Cycle", payment.billingCycle) : null}
                  {payment?.amount
                    ? renderInfoRow(
                        "Payment",
                        `${payment.amount} ${payment.currency || ""} (${payment.status || "unknown"})`
                      )
                    : null}

                  {providerBusiness?.businessName ? (
                    <>
                      {renderInfoRow("Business Name", providerBusiness.businessName)}
                      {renderInfoRow(
                        "Business Type",
                        providerBusiness.legalBusinessName || providerBusiness.businessType
                      )}
                      {renderInfoRow(
                        "Business Contact",
                        providerBusiness.businessMail || providerBusiness.businessPhoneNo
                      )}
                    </>
                  ) : null}

                  {detailCategories.length ? (
                    <div>
                      <span className="font-medium text-gray-700 block mb-2">Categories</span>
                      <div className="flex flex-wrap gap-2">
                        {detailCategories.map((category) => (
                          <span
                            key={category}
                            className="px-3 py-1 text-sm bg-gray-100 text-[#B74140] rounded"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <div className="flex gap-3 p-6 border-t">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleCloseModal();
                  handleOpenActionModal(selectedUser);
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#B74140] rounded-lg hover:bg-[#a03635]"
              >
                {isBlockedMode ? "Unblock" : "Block"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isConfirmModalOpen && userToAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-sm p-6 mx-4 text-center bg-white rounded-lg">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              {isBlockedMode
                ? "Do you want to unblock this user?"
                : "Do you want to block this user?"}
            </h2>

            <p className="text-sm text-gray-600 mb-4">{userToAction.name}</p>
            {actionError && <p className="text-sm text-red-500 mb-4">{actionError}</p>}

            <div className="flex gap-3">
              <button
                onClick={handleCloseActionModal}
                disabled={isActionLoading}
                className="flex-1 px-4 py-2 text-sm bg-white border rounded-lg disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmAction}
                disabled={isActionLoading}
                className="flex-1 px-4 py-2 text-sm text-white bg-[#B74140] rounded-lg disabled:opacity-50"
              >
                {isActionLoading
                  ? isBlockedMode
                    ? "Unblocking..."
                    : "Blocking..."
                  : isBlockedMode
                  ? "Yes, Unblock"
                  : "Yes, Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDirectory;
