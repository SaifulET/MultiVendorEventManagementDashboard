import { Eye, FilePlus, X } from "lucide-react";
import { useState } from "react";

const Earnings = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const itemsPerPage = 8;
  const totalItems = 250;

  const subscriptions = [
    {
      id: "01",
      name: "Robert Fox",
      avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT16eO5W8VPjVFrkvG8n_2FQKjByMcbLtBF4A&s",
      trxId: "#123456",
      plan: "Monthly",
      price: "$75",
      date: "02-24-2024",
      email: "robert@email.com",
      accountNumber: "**** **** **** *545",
      fullTrxId: "#12345678",
    },
    {
      id: "02",
      name: "John Doe",
      avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT16eO5W8VPjVFrkvG8n_2FQKjByMcbLtBF4A&s",
      trxId: "#123457",
      plan: "Monthly",
      price: "$75",
      date: "02-24-2024",
      email: "john@email.com",
      accountNumber: "**** **** **** *545",
      fullTrxId: "#12345678",
    },
    {
      id: "03",
      name: "Jane Smith",
      avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT16eO5W8VPjVFrkvG8n_2FQKjByMcbLtBF4A&s",
      trxId: "#123458",
      plan: "Monthly",
      price: "$75",
      date: "02-24-2024",
      email: "jane@email.com",
      accountNumber: "**** **** **** *545",
      fullTrxId: "#12345678",
    },
    {
      id: "04",
      name: "Mike Johnson",
      avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT16eO5W8VPjVFrkvG8n_2FQKjByMcbLtBF4A&s",
      trxId: "#123459",
      plan: "6 Months",
      price: "$405",
      date: "02-24-2024",
      email: "mike@email.com",
      accountNumber: "**** **** **** *545",
      fullTrxId: "#12345678",
    },
    {
      id: "05",
      name: "Sarah Wilson",
      avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT16eO5W8VPjVFrkvG8n_2FQKjByMcbLtBF4A&s",
      trxId: "#123460",
      plan: "6 Months",
      price: "$405",
      date: "02-24-2024",
      email: "sarah@email.com",
      accountNumber: "**** **** **** *545",
      fullTrxId: "#12345678",
    },
    {
      id: "06",
      name: "David Brown",
      avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT16eO5W8VPjVFrkvG8n_2FQKjByMcbLtBF4A&s",
      trxId: "#123461",
      plan: "6 Months",
      price: "$405",
      date: "02-24-2024",
      email: "david@email.com",
      accountNumber: "**** **** **** *545",
      fullTrxId: "#12345678",
    },
    {
      id: "07",
      name: "Lisa Garcia",
      avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT16eO5W8VPjVFrkvG8n_2FQKjByMcbLtBF4A&s",
      trxId: "#123462",
      plan: "Yearly",
      price: "$705",
      date: "02-24-2024",
      email: "lisa@email.com",
      accountNumber: "**** **** **** *545",
      fullTrxId: "#12345678",
    },
    {
      id: "08",
      name: "Tom Anderson",
      avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT16eO5W8VPjVFrkvG8n_2FQKjByMcbLtBF4A&s",
      trxId: "#123463",
      plan: "Yearly",
      price: "$705",
      date: "02-24-2024",
      email: "tom@email.com",
      accountNumber: "**** **** **** *545",
      fullTrxId: "#12345678",
    },
  ];

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handleDownload = (trxId) => {
    alert(`Downloading transaction ${trxId}`);
  };

  const handleView = (subscription) => {
    setSelectedTransaction(subscription);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTransaction(null);
  };

  const handleDownloadInvoice = () => {
    if (selectedTransaction) {
      alert(
        `Downloading invoice for transaction ${selectedTransaction.fullTrxId}`
      );
      handleCloseModal();
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
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

    // Page numbers
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
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {i}
        </button>
      );
    }

    // Add ellipsis and jump pages
    if (endPage < totalPages) {
      buttons.push(
        <span key="ellipsis" className="px-2 py-2 text-gray-500">
          ...
        </span>
      );

      // Add some jump pages
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
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          );
        }
      });
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
      <div className="mx-auto mt-16">
        <div
          style={{ boxShadow: "0px 1px 6px 0px rgba(0, 0, 0, 0.24)" }}
          className="flex flex-wrap justify-between p-5 my-2 rounded-md md:flex-nowrap"
        >
          {/*  Today */}
          <div className="bg-[#f6f6f6] flex justify-center w-1/4 border-r-2 border-[#DADADA]">
            <div className="flex flex-col gap-5">
              <p className="text-[#1C2434] text-2xl font-bold">38.6K</p>
              <p className="text-xl text-[#101010] font-semibold">
                Today
              </p>
            </div>
          </div>
          {/* New User  */}
          <div className="bg-[##f6f6f6] flex justify-center w-1/4 border-r-2 border-[#DADADA]">
            <div className="flex flex-col gap-5">
              <p className="text-[#1C2434] text-2xl font-bold">18.6k</p>
              <p className="text-xl text-[#101010] font-semibold">
                This Month
              </p>
            </div>
          </div>
          {/* Old User */}
          <div className="bg-[##f6f6f6] flex justify-center w-1/4">
            <div className="flex flex-col gap-5">
              <p className="text-[#1C2434] text-2xl font-bold">4.9M</p>
              <p className="text-xl text-[#101010] font-semibold">
                Total Revenue
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-white bg-[#71ABE0]">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium text-left">
                    S.ID
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-left">
                    Full Name
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-left">
                    Trx ID
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-left">
                    Plans
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-left">
                    Price
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-left">
                    Date
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-left">
                    Action
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
                          src={subscription.avatar || "/placeholder.svg"}
                          alt={subscription.name}
                          className="object-cover w-8 h-8 rounded-full"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {subscription.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {subscription.trxId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {subscription.plan}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {subscription.price}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {subscription.date}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownload(subscription.trxId)}
                          className="p-1 text-gray-500 transition-colors hover:text-gray-700"
                          title="Download"
                        >
                          <FilePlus className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleView(subscription)}
                          className="p-1 text-[#71ABE0] transition-colors hover:text-gray-700"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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

      {/* Transaction Details Modal */}
      {showModal && selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center mb-6">
              <h2 className="text-2xl font-semibold  text-[#71ABE0] w-4/5">
                Transaction Details
              </h2>
             <div className="flex self-end justify-end w-1/5">
               <button
                onClick={handleCloseModal}
                className="text-gray-400 transition-colors hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
             </div>
            </div>

            {/* Transaction Information */}
            <div className="mb-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">
                  Transaction ID
                </span>
                <span className="text-gray-900">
                  {selectedTransaction.fullTrxId}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Plans</span>
                <span className="text-gray-900">
                  {selectedTransaction.plan} Subscription
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Date</span>
                <span className="text-gray-900">
                  {selectedTransaction.date}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Name</span>
                <span className="text-gray-900">
                  {selectedTransaction.name}.
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">A/C number</span>
                <span className="text-gray-900">
                  {selectedTransaction.accountNumber}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Email</span>
                <span className="text-gray-900">
                  {selectedTransaction.email}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">
                  Transaction amount
                </span>
                <span className="font-semibold text-gray-900">
                  {selectedTransaction.price}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 font-medium text-[#71ABE0] transition-colors border-2 border-[#71ABE0] rounded-lg hover:bg-blue-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDownloadInvoice}
                className="flex-1 px-4 py-2 font-medium text-white transition-colors bg-[#71ABE0] rounded-lg hover:bg-blue-400"
              >
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Earnings;
