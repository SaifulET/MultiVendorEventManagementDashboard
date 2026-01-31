"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Reports = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalItems = 250;

  // Generate more sample data to demonstrate pagination
  const allReportData = Array.from({ length: totalItems }, (_, index) => ({
    id: (index + 1).toString().padStart(2, "0"),
    reportFrom: "Robert Fox",
    reportReason: ["Unprofessional behaviour", "Spam", "Other"][index % 3],
    reportTo: "Robert Fox",
    date: "02-24-2025",
  }));

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = allReportData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getVisiblePages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, "...", totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          2,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div
        style={{ boxShadow: "0px 1px 6px 0px rgba(0, 0, 0, 0.24)" }}
        className="mx-auto mt-16"
      >
        {/* Card Container */}
        <div className="overflow-hidden bg-white rounded-lg shadow-md">
          {/* Header */}
          <div className="px-6 py-4 text-white bg-[#71ABE0]">
            <h1 className="text-xl font-semibold">Reports</h1>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header */}
              <thead>
                <tr className="bg-white border-b">
                  <th className="w-16 px-4 py-3 text-sm font-medium text-center text-[#71ABE0]">
                    S.ID
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-left text-[#71ABE0]">
                    Report From
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-left text-[#71ABE0]">
                    Report Reason
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-left text-[#71ABE0]">
                    Report To
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-left text-[#71ABE0]">
                    Date & Time
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {currentData.map((report, index) => (
                  <tr
                    key={startIndex + index}
                    className="transition-colors border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium text-center">
                      {report.id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full">
                          <img
                            className="rounded-full"
                            src="https://images.ctfassets.net/xjcz23wx147q/iegram9XLv7h3GemB5vUR/0345811de2da23fafc79bd00b8e5f1c6/Max_Rehkopf_200x200.jpeg"
                            alt=""
                          />
                        </div>
                        <span className="font-medium">{report.reportFrom}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {report.reportReason}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full">
                          <img
                            className="rounded-full"
                            src="https://images.ctfassets.net/xjcz23wx147q/iegram9XLv7h3GemB5vUR/0345811de2da23fafc79bd00b8e5f1c6/Max_Rehkopf_200x200.jpeg"
                            alt=""
                          />
                        </div>
                        <span className="font-medium">{report.reportTo}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{report.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
            <div className="text-sm font-medium text-[#71ABE0]">
              SHOWING {startIndex + 1}-{Math.min(endIndex, totalItems)} OF{" "}
              {totalItems}
            </div>

            <div className="flex items-center gap-1">
              {/* Previous Button */}
              <button
                className={`w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 transition-colors ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Numbers */}
              {getVisiblePages().map((page, index) => (
                <div key={index}>
                  {page === "..." ? (
                    <span className="px-2 text-gray-500">...</span>
                  ) : (
                    <button
                      className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-[#71ABE0] text-white hover:bg-[#71ABE0]"
                          : "hover:bg-gray-200 text-gray-700"
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  )}
                </div>
              ))}

              {/* Next Button */}
              <button
                className={`w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 transition-colors ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
