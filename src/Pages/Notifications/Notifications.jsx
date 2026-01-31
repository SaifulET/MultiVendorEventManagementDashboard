import React, { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Bell } from "lucide-react";

const generateNotifications = (count = 50) => {
  const messages = [
    "Profile report!",
    "A new Verification request!",
    "A new user join in your app.",
  ];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    message: messages[i % messages.length],
    time: "Fri, 12:30pm",
  }));
};

const PAGE_SIZE = 10;

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setNotifications(generateNotifications(123)); // You can change total count here
  }, []);

  const totalPages = Math.ceil(notifications.length / PAGE_SIZE);
  const currentItems = notifications.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="w-full bg-white shadow-lg rounded-xl">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 text-white bg-sky-600 rounded-t-xl">
          <IoIosArrowBack className="cursor-pointer" onClick={() => history.back()} />
          <h2 className="text-lg font-semibold">All Notifications</h2>
        </div>

        {/* Notification List */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {currentItems.map((notif) => (
            <div key={notif.id} className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-md">
                <Bell size={18} className="text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{notif.message}</p>
                <p className="text-xs text-gray-500">{notif.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t">
          <span className="text-sm text-gray-600">
            Showing {Math.min(page * PAGE_SIZE, notifications.length)} of {notifications.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-40"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              <IoIosArrowBack />
              Previous
            </button>

            {/* Page Numbers */}
            {(() => {
              let startPage = Math.max(1, page - 1);
              const pages = [];
              for (let i = startPage; i < startPage + 3 && i <= totalPages; i++) {
                pages.push(i);
              }
              return pages.map((pNum) => (
                <button
                  key={pNum}
                  className={`px-3 py-1 border rounded-full text-sm ${
                    page === pNum
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 text-gray-700"
                  }`}
                  onClick={() => setPage(pNum)}
                >
                  {pNum}
                </button>
              ));
            })()}

            {totalPages > 3 && (
              <span className="text-sm text-gray-400">... {totalPages}</span>
            )}

            <button
              className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-40"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
              <IoIosArrowForward />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
