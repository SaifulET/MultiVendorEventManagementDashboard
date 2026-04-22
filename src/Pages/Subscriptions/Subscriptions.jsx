"use client";

import { CircleX, Eye, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../../config/api";
import useAuthStore from "../../store/useAuthStore";

const DEFAULT_META = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
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

const formatPlan = (value) => {
  if (!value) {
    return "Unavailable";
  }

  return value
    .split(/[_-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const formatAmount = (amount, currency) => {
  if (amount === null || amount === undefined || amount === "") {
    return "Unavailable";
  }

  return `${amount} ${currency || ""}`.trim();
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

const normalizeSubscription = (subscription) => ({
  id: subscription?.id,
  userId: subscription?.userId || subscription?.id,
  name: subscription?.fullName || "Unknown User",
  email: subscription?.email || "No email provided",
  status: subscription?.paymentStatus || subscription?.subscriptionStatus || "unknown",
  plan: formatPlan(subscription?.planValidity || subscription?.plan),
  planName: formatPlan(subscription?.plan),
  expirationDate: formatDate(subscription?.expiryDate),
  amountPaid: formatAmount(subscription?.amountPaid, subscription?.currency),
  role: formatPlan(subscription?.role),
});

const normalizeTransactionRows = (details) => {
  const transactions = Array.isArray(details?.transactionDetails)
    ? details.transactionDetails
    : details?.transactionDetails
    ? [details.transactionDetails]
    : [];
  const user = details?.user || {};
  const subscription = details?.subscription || {};

  const sourceRows = transactions.length ? transactions : [subscription];

  return sourceRows.map((transaction, index) => ({
    id: transaction.transactionId || subscription.transactionId || `${user.id || "transaction"}-${index}`,
    transactionId:
      transaction.transactionId || subscription.transactionId || "Unavailable",
    plan: formatPlan(transaction.plan || subscription.plan),
    planValidity: formatPlan(transaction.planValidity || subscription.planValidity),
    date: formatDate(transaction.date || transaction.paidAt || subscription.paidAt || subscription.activatedAt),
    amount: formatAmount(
      transaction.transactionAmount ?? transaction.amountPaid ?? subscription.amountPaid,
      transaction.currency || subscription.currency
    ),
    status: transaction.status || transaction.paymentStatus || subscription.paymentStatus || "unknown",
    expiryDate: formatDate(transaction.expiryDate || subscription.expiryDate),
  }));
};

const Subscriptions = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showManageFeesModal, setShowManageFeesModal] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [meta, setMeta] = useState(DEFAULT_META);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [transactionRows, setTransactionRows] = useState([]);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isTransactionLoading, setIsTransactionLoading] = useState(false);
  const [transactionError, setTransactionError] = useState("");

  const [subscriptionFees, setSubscriptionFees] = useState({
    monthly: 75,
    sixMonth: 405,
    yearly: 720,
  });

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!accessToken) {
        setSubscriptions([]);
        setMeta(DEFAULT_META);
        setError("You need to sign in first.");
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const query = new URLSearchParams({
          page: String(currentPage),
          limit: String(itemsPerPage),
          sortBy: "createdAt",
          sortOrder: "desc",
        });

        const response = await fetch(`${API_BASE_URL}/api/v1/admin/subscriptions?${query}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const result = await response.json();

        if (!response.ok || !result?.success) {
          throw new Error(result?.message || "Failed to load subscriptions.");
        }

        setSubscriptions(
          Array.isArray(result?.data) ? result.data.map(normalizeSubscription) : []
        );
        setMeta({
          page: result?.meta?.page ?? currentPage,
          limit: result?.meta?.limit ?? itemsPerPage,
          total: result?.meta?.total ?? 0,
          totalPages: result?.meta?.totalPages ?? 1,
          hasNextPage: Boolean(result?.meta?.hasNextPage),
          hasPrevPage: Boolean(result?.meta?.hasPrevPage),
        });
      } catch (subscriptionError) {
        setSubscriptions([]);
        setMeta(DEFAULT_META);
        setError(subscriptionError.message || "Failed to load subscriptions.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, [accessToken, currentPage]);

  const filteredSubscriptions = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    if (!normalizedSearch) {
      return subscriptions;
    }

    return subscriptions.filter(
      (subscription) =>
        subscription.name.toLowerCase().includes(normalizedSearch) ||
        subscription.email.toLowerCase().includes(normalizedSearch) ||
        subscription.plan.toLowerCase().includes(normalizedSearch) ||
        subscription.status.toLowerCase().includes(normalizedSearch)
    );
  }, [searchQuery, subscriptions]);

  const totalPages = Math.max(meta.totalPages || 1, 1);
  const startItem = subscriptions.length ? (meta.page - 1) * meta.limit + 1 : 0;
  const endItem = Math.min((meta.page - 1) * meta.limit + subscriptions.length, meta.total);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleManageFees = () => {
    setShowManageFeesModal(true);
  };

  const handleCloseModal = () => {
    setShowManageFeesModal(false);
  };

  const handleUpdateFees = () => {
    alert("Fees updated successfully!");
    setShowManageFeesModal(false);
  };

  const handleResetToDefault = () => {
    setSubscriptionFees({
      monthly: 75,
      sixMonth: 405,
      yearly: 720,
    });
    alert("Fees reset to default values!");
  };

  const handleViewTransaction = async (subscription) => {
    if (!subscription?.userId || !accessToken) {
      return;
    }

    setSelectedSubscription(subscription);
    setTransactionRows([]);
    setTransactionError("");
    setIsTransactionLoading(true);
    setIsTransactionModalOpen(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/admin/subscriptions/${subscription.userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Failed to load transaction details.");
      }

      setTransactionRows(normalizeTransactionRows(result?.data));
    } catch (detailsError) {
      setTransactionError(detailsError.message || "Failed to load transaction details.");
    } finally {
      setIsTransactionLoading(false);
    }
  };

  const handleCloseTransactionModal = () => {
    setIsTransactionModalOpen(false);
    setSelectedSubscription(null);
    setTransactionRows([]);
    setTransactionError("");
  };

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "paid":
      case "subscribed":
        return "text-green-600 bg-green-50";
      case "expired":
      case "unpaid":
      case "not_subscribed":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];

    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={!meta.hasPrevPage || isLoading}
        className="px-3 py-2 text-gray-500 hover:text-[#B74140] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    );

    for (let page = 1; page <= totalPages; page += 1) {
      if (
        page === 1 ||
        page === totalPages ||
        Math.abs(page - currentPage) <= 1
      ) {
        buttons.push(
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            disabled={isLoading}
            className={`px-3 py-2 text-sm font-medium rounded ${
              currentPage === page
                ? "bg-[#B74140] text-white"
                : "text-[#B74140] hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        );
      } else if (
        (page === currentPage - 2 && page > 1) ||
        (page === currentPage + 2 && page < totalPages)
      ) {
        buttons.push(
          <span key={`ellipsis-${page}`} className="px-2 py-2 text-gray-500">
            ...
          </span>
        );
      }
    }

    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={!meta.hasNextPage || isLoading}
        className="px-3 py-2 text-gray-500 hover:text-[#B74140] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    );

    return buttons;
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div
        style={{ boxShadow: "0px 1px 6px 0px rgba(0, 0, 0, 0.24)" }}
        className="mx-auto mt-16"
      >
        <div className="px-6 py-4 bg-[#B74140] rounded-t-lg">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h1 className="text-2xl font-semibold text-white">Subscriptions</h1>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search User"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full py-2 pl-10 pr-3 leading-5 placeholder-gray-500 bg-white border border-gray-300 rounded-md sm:w-80 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleManageFees}
                className="px-4 py-2 font-medium text-[#B74140] transition-colors bg-white rounded-md hover:bg-gray-50"
              >
                Manages Fees
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-white border border-gray-200 rounded-b-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium text-left text-[#B74140]">
                    S.ID
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-left text-[#B74140]">
                    User
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-left text-[#B74140]">
                    Email
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-left text-[#B74140]">
                    Status
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-left text-[#B74140]">
                    Plans
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-left text-[#B74140]">
                    Expiration Date
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-left text-[#B74140]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading && (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                      Loading subscriptions...
                    </td>
                  </tr>
                )}

                {!isLoading && error && (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center text-red-500">
                      {error}
                    </td>
                  </tr>
                )}

                {!isLoading && !error && filteredSubscriptions.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                      No subscriptions found.
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  !error &&
                  filteredSubscriptions.map((subscription, index) => (
                    <tr
                      key={subscription.id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100`}
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {String((meta.page - 1) * meta.limit + index + 1).padStart(2, "0")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#F3D7D7] text-[#B74140] flex items-center justify-center text-sm font-semibold">
                            {getInitials(subscription.name)}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {subscription.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {subscription.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            subscription.status
                          )}`}
                        >
                          {formatPlan(subscription.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {subscription.plan}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {subscription.expirationDate}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleViewTransaction(subscription)}
                          className="p-1 text-[#B74140] rounded-full hover:bg-red-50"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
            <div className="text-sm font-medium text-[#B74140]">
              SHOWING {startItem}-{endItem} OF {meta.total}
            </div>
            <div className="flex items-center gap-1">
              {renderPaginationButtons()}
            </div>
          </div>
        </div>
      </div>

      {isTransactionModalOpen && selectedSubscription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-4xl mx-4 bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="flex-1 text-2xl font-semibold text-center text-[#B74140]">
                Transaction Details
              </h2>
              <button
                onClick={handleCloseTransactionModal}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 mr-4 rounded-full bg-[#F3D7D7] text-[#B74140] flex items-center justify-center text-xl font-semibold">
                  {getInitials(selectedSubscription.name)}
                </div>
                <div>
                  <h3 className="text-xl font-medium text-[#B74140]">
                    {selectedSubscription.name}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedSubscription.email}</p>
                </div>
              </div>

              {isTransactionLoading && (
                <p className="text-center text-gray-500">Loading transaction details...</p>
              )}

              {!isTransactionLoading && transactionError && (
                <p className="text-center text-red-500">{transactionError}</p>
              )}

              {!isTransactionLoading && !transactionError && (
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-[#B74140] uppercase">
                          S.ID
                        </th>
                        <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-[#B74140] uppercase">
                          Transaction ID
                        </th>
                        <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-[#B74140] uppercase">
                          Plan
                        </th>
                        <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-[#B74140] uppercase">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-[#B74140] uppercase">
                          Status
                        </th>
                        <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-[#B74140] uppercase">
                          Paid Date
                        </th>
                        <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-[#B74140] uppercase">
                          Expiry Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactionRows.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                            No transactions found.
                          </td>
                        </tr>
                      ) : (
                        transactionRows.map((transaction, index) => (
                          <tr key={transaction.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                              {String(index + 1).padStart(2, "0")}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                              {transaction.transactionId}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                              {transaction.planValidity}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                              {transaction.amount}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                  transaction.status
                                )}`}
                              >
                                {formatPlan(transaction.status)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                              {transaction.date}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                              {transaction.expiryDate}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex gap-3 p-6 border-t">
              <button
                onClick={handleCloseTransactionModal}
                className="flex-1 px-4 py-2 text-sm font-medium bg-white border rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showManageFeesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl mx-4 bg-white rounded-lg shadow-xl">
            <div className="px-6 py-4 text-center text-white bg-[#B74140] rounded-t-lg">
              <h2 className="text-xl font-semibold">Manage Fees</h2>
              <div className="flex items-center justify-end">
                <button
                  onClick={handleCloseModal}
                  className="text-white transition-colors hover:text-gray-200"
                >
                  <CircleX />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div>
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-gray-800">
                    Subscriptions Fees
                  </h3>

                  <div className="p-4 mb-6 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-center mb-3">
                      <span className="text-sm font-medium text-[#B74140]">
                        Monthly Plans: ${subscriptionFees.monthly}
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            setSubscriptionFees({
                              ...subscriptionFees,
                              monthly: Math.max(1, subscriptionFees.monthly - 1),
                            })
                          }
                          className="flex items-center justify-center w-8 h-8 transition-colors bg-gray-200 rounded-full hover:bg-gray-300"
                        >
                          <span className="font-bold text-gray-600">-</span>
                        </button>
                        <span className="text-lg font-semibold text-gray-800 min-w-[40px] text-center">
                          {subscriptionFees.monthly}
                        </span>
                        <button
                          onClick={() =>
                            setSubscriptionFees({
                              ...subscriptionFees,
                              monthly: subscriptionFees.monthly + 1,
                            })
                          }
                          className="flex items-center justify-center w-8 h-8 text-white transition-colors bg-[#B74140] rounded-full hover:bg-blue-400"
                        >
                          <span className="font-bold">+</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 mb-6 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-center mb-3">
                      <span className="text-sm font-medium text-[#B74140]">
                        Current Value: ${subscriptionFees.sixMonth}
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            setSubscriptionFees({
                              ...subscriptionFees,
                              sixMonth: Math.max(1, subscriptionFees.sixMonth - 1),
                            })
                          }
                          className="flex items-center justify-center w-8 h-8 transition-colors bg-gray-200 rounded-full hover:bg-gray-300"
                        >
                          <span className="font-bold text-gray-600">-</span>
                        </button>
                        <span className="text-lg font-semibold text-gray-800 min-w-[50px] text-center">
                          {subscriptionFees.sixMonth}
                        </span>
                        <button
                          onClick={() =>
                            setSubscriptionFees({
                              ...subscriptionFees,
                              sixMonth: subscriptionFees.sixMonth + 1,
                            })
                          }
                          className="flex items-center justify-center w-8 h-8 text-white transition-colors bg-[#B74140] rounded-full hover:bg-blue-400"
                        >
                          <span className="font-bold">+</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 mb-6 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-center mb-3">
                      <span className="text-sm font-medium text-[#B74140]">
                        Current Value: ${subscriptionFees.yearly}
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            setSubscriptionFees({
                              ...subscriptionFees,
                              yearly: Math.max(1, subscriptionFees.yearly - 1),
                            })
                          }
                          className="flex items-center justify-center w-8 h-8 transition-colors bg-gray-200 rounded-full hover:bg-gray-300"
                        >
                          <span className="font-bold text-gray-600">-</span>
                        </button>
                        <span className="text-lg font-semibold text-gray-800 min-w-[50px] text-center">
                          {subscriptionFees.yearly}
                        </span>
                        <button
                          onClick={() =>
                            setSubscriptionFees({
                              ...subscriptionFees,
                              yearly: subscriptionFees.yearly + 1,
                            })
                          }
                          className="flex items-center justify-center w-8 h-8 text-white transition-colors bg-[#B74140] rounded-full hover:bg-blue-400"
                        >
                          <span className="font-bold">+</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-6 mt-8 border-t border-gray-200">
                <button
                  onClick={handleUpdateFees}
                  className="px-6 py-2 font-medium text-[#175994] transition-colors border-2 border-[#B74140] rounded-lg hover:bg-blue-50"
                >
                  Update fee
                </button>
                <button
                  onClick={handleResetToDefault}
                  className="px-6 py-2 font-medium text-white transition-colors bg-[#B74140] rounded-lg hover:bg-[#1e496f]"
                >
                  Reset to default
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
