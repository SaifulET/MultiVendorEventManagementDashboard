"use client";

import { CircleX, Search, X } from "lucide-react";
import { useState } from "react";

const Subscriptions = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showManageFeesModal, setShowManageFeesModal] = useState(false);

  const [subscriptionFees, setSubscriptionFees] = useState({
    monthly: 75,
    sixMonth: 405,
    yearly: 720,
  });

  const [creditPrices, setCreditPrices] = useState({
    credits20: 20,
    credits50: 45,
    credits100: 80,
  });

  const itemsPerPage = 8;
  const totalItems = 250;

  const subscriptions = [
    {
      id: "01",
      user: {
        name: "Robert Fox",
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQEZrATmgHOi5ls0YCCQBTkocia_atSw0X-Q&s",
      },
      email: "fox@email",
      status: "Paid",
      plan: "Monthly",
      expirationDate: "02-24-2024",
    },
    {
      id: "01",
      user: {
        name: "Robert Fox",
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQEZrATmgHOi5ls0YCCQBTkocia_atSw0X-Q&s",
      },
      email: "fox@email",
      status: "Paid",
      plan: "Monthly",
      expirationDate: "02-24-2024",
    },
    {
      id: "01",
      user: {
        name: "Robert Fox",
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQEZrATmgHOi5ls0YCCQBTkocia_atSw0X-Q&s",
      },
      email: "fox@email",
      status: "Paid",
      plan: "Monthly",
      expirationDate: "02-24-2024",
    },
    {
      id: "01",
      user: {
        name: "Robert Fox",
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQEZrATmgHOi5ls0YCCQBTkocia_atSw0X-Q&s",
      },
      email: "fox@email",
      status: "Expired",
      plan: "6 Months",
      expirationDate: "02-24-2024",
    },
    {
      id: "01",
      user: {
        name: "Robert Fox",
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQEZrATmgHOi5ls0YCCQBTkocia_atSw0X-Q&s",
      },
      email: "fox@email",
      status: "Expired",
      plan: "6 Months",
      expirationDate: "02-24-2024",
    },
    {
      id: "01",
      user: {
        name: "Robert Fox",
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQEZrATmgHOi5ls0YCCQBTkocia_atSw0X-Q&s",
      },
      email: "fox@email",
      status: "Expired",
      plan: "6 Months",
      expirationDate: "02-24-2024",
    },
    {
      id: "01",
      user: {
        name: "Robert Fox",
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQEZrATmgHOi5ls0YCCQBTkocia_atSw0X-Q&s",
      },
      email: "fox@email",
      status: "Expired",
      plan: "Yearly",
      expirationDate: "02-24-2024",
    },
    {
      id: "01",
      user: {
        name: "Robert Fox",
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQEZrATmgHOi5ls0YCCQBTkocia_atSw0X-Q&s",
      },
      email: "fox@email",
      status: "Expired",
      plan: "Yearly",
      expirationDate: "02-24-2024",
    },
  ];

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

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
    setCreditPrices({
      credits20: 20,
      credits50: 45,
      credits100: 80,
    });
    alert("Fees reset to default values!");
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "text-green-600 bg-green-50";
      case "expired":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    // =====================Previous button=====================
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-2 text-gray-500 hover:text-[#71ABE0] disabled:opacity-50 disabled:cursor-not-allowed"
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

    // =========================Page numbers=========================
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= Math.min(endPage, 4); i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium rounded ${
            currentPage === i
              ? "bg-[#71ABE0] text-white"
              : "text-[#71ABE0] hover:bg-gray-100"
          }`}
        >
          {i}
        </button>
      );
    }

    // ============================Add ellipsis and jump pages============================
    if (endPage < totalPages) {
      buttons.push(
        <span key="ellipsis" className="px-2 py-2 text-gray-500">
          ...
        </span>
      );

      // =========================Add some jump pages=========================
      const jumpPages = [30, 60, 120];
      jumpPages.forEach((page) => {
        if (page <= totalPages) {
          buttons.push(
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 text-sm font-medium rounded ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "text-[#71ABE0] hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          );
        }
      });
    }

    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-gray-500 hover:text-[#71ABE0] disabled:opacity-50 disabled:cursor-not-allowed"
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
        {/*========================== Header ==========================*/}
        <div className="px-6 py-4 bg-[#71ABE0] rounded-t-lg">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">Subscriptions</h1>
            <div className="flex items-center gap-4">
              {/*========================== Search Bar ==========================*/}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search User"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block py-2 pl-10 pr-3 leading-5 placeholder-gray-500 bg-white border border-gray-300 rounded-md w-80 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {/*============================ Manage Fees Button============================ */}
              <button
                onClick={handleManageFees}
                className="px-4 py-2 font-medium text-blue-500 transition-colors bg-white rounded-md hover:bg-gray-50"
              >
                Manages Fees
              </button>
            </div>
          </div>
        </div>

        {/*============================== Table============================== */}
        <div className="overflow-hidden bg-white border border-gray-200 rounded-b-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium text-left text-[#71ABE0]">
                    S.ID
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-left text-[#71ABE0]">
                    User
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-left text-[#71ABE0]">
                    Email
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-left text-[#71ABE0]">
                    Status
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-left text-[#71ABE0]">
                    Plans
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-left text-[#71ABE0]">
                    Expiration Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {subscriptions.map((subscription, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {subscription.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={subscription.user.avatar || "/placeholder.svg"}
                          alt={subscription.user.name}
                          className="object-cover w-10 h-10 rounded-full"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {subscription.user.name}
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
                        {subscription.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {subscription.plan}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {subscription.expirationDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/*===================== Pagination =====================*/}
          <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
            <div className="text-sm font-medium text-[#71ABE0]">
              SHOWING {startItem}-{endItem} OF {totalItems}
            </div>
            <div className="flex items-center gap-1">
              {renderPaginationButtons()}
            </div>
          </div>
        </div>
      </div>

      {/*================================================Manage Fees Modal================================================ */}
      {showManageFeesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl mx-4 bg-white rounded-lg shadow-xl">
            {/* ================================================Modal Header================================================ */}
            <div className="px-6 py-4 text-center text-white bg-[#71ABE0] rounded-t-lg">
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

            {/*==================================== Modal Content ====================================*/}
            <div className="p-6">
              <div >
                {/*==================================== Subscription Fees Section ====================================*/}
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-gray-800">
                    Subscriptions Fees
                  </h3>

                  {/* ====================================Monthly Plans ====================================*/}
                  <div className="p-4 mb-6 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-center mb-3">
                      <span className="text-sm font-medium text-[#71ABE0]">
                        Monthly Plans: ${subscriptionFees.monthly}
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            setSubscriptionFees({
                              ...subscriptionFees,
                              monthly: Math.max(
                                1,
                                subscriptionFees.monthly - 1
                              ),
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
                          className="flex items-center justify-center w-8 h-8 text-white transition-colors bg-[#71ABE0] rounded-full hover:bg-blue-400"
                        >
                          <span className="font-bold">+</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ================================6 Month Plan================================ */}
                  <div className="p-4 mb-6 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-center mb-3">
                      <span className="text-sm font-medium text-[#71ABE0]">
                        Current Value: ${subscriptionFees.sixMonth}
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            setSubscriptionFees({
                              ...subscriptionFees,
                              sixMonth: Math.max(
                                1,
                                subscriptionFees.sixMonth - 1
                              ),
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
                          className="flex items-center justify-center w-8 h-8 text-white transition-colors bg-[#71ABE0] rounded-full hover:bg-blue-400"
                        >
                          <span className="font-bold">+</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ================================Yearly Plan================================ */}
                  <div className="p-4 mb-6 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-center mb-3">
                      <span className="text-sm font-medium text-[#71ABE0]">
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
                          className="flex items-center justify-center w-8 h-8 text-white transition-colors bg-[#71ABE0] rounded-full hover:bg-blue-400"
                        >
                          <span className="font-bold">+</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

             
              </div>

              {/*================================ Modal Actions ================================*/}
              <div className="flex justify-center gap-4 pt-6 mt-8 border-t border-gray-200">
                <button
                  onClick={handleUpdateFees}
                  className="px-6 py-2 font-medium text-[#175994] transition-colors border-2 border-[#71ABE0] rounded-lg hover:bg-blue-50"
                >
                  Update fee
                </button>
                <button
                  onClick={handleResetToDefault}
                  className="px-6 py-2 font-medium text-white transition-colors bg-[#71ABE0] rounded-lg hover:bg-[#1e496f]"
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
