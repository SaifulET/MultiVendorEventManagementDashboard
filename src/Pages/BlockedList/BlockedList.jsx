import { useState } from "react";
import { Search, Eye, ChevronLeft, ChevronRight, X } from "lucide-react";
import { VscDebugRestart } from "react-icons/vsc";

const BlockedList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToBlock, setUserToBlock] = useState(null);

  // Random name list
  const randomNames = [
    "John Carter", "Sophia Adams", "Liam Wilson", "Emma Johnson",
    "Noah Walker", "Olivia Brown", "Mason Davis", "Ava Martinez",
    "James Miller", "Amelia Taylor", "Benjamin Moore", "Mia Anderson",
    "Lucas Thomas", "Charlotte Lee", "Henry White", "Isabella Harris",
    "Logan Hall", "Evelyn Scott", "Alexander Young", "Grace King"
  ];

  // Generate random users
  const users = Array.from({ length: 20 }, (_, i) => {
    const name = randomNames[Math.floor(Math.random() * randomNames.length)];

    return {
      id: i + 1,
      name,
      email: `${name.toLowerCase().replace(/ /g, "")}${i + 1}@gmail.com`,
      joinedDate: "02-24-2024",
      avatar:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000",
    };
  });

  const totalUsers = users.length;
  const usersPerPage = 8;
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  // Pagination
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = users.slice(startIndex, startIndex + usersPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // OPEN VIEW MODAL
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // CLOSE VIEW MODAL
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // OPEN UNBLOCK CONFIRMATION MODAL
  const handleBanUser = (user) => {
    setUserToBlock(user);
    setIsConfirmModalOpen(true);
  };

  // CONFIRM UNBLOCK
  const handleConfirmBlock = () => {
    console.log("Unblocking user:", userToBlock);

    // Close modal properly
    setIsConfirmModalOpen(false);
    setUserToBlock(null);
  };

  // CANCEL UNBLOCK
  const handleCancelBlock = () => {
    setIsConfirmModalOpen(false);
    setUserToBlock(null);
  };

  const renderPaginationNumbers = () => {
    const pages = [];
    pages.push(1);

    if (currentPage > 3) pages.push("...");

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (!pages.includes(i)) pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push("...");

    if (totalPages > 1 && !pages.includes(totalPages)) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div
        style={{ boxShadow: "0px 1px 6px rgba(0,0,0,0.24)" }}
        className="mx-auto mt-16"
      >
        {/* Header */}
        <div className="px-6 py-4 mb-6 rounded-tl-lg rounded-tr-lg bg-[#71ABE0]">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">Blocked List</h1>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  placeholder="Search User"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 py-2 pl-10 pr-4 text-sm bg-white border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-300"
                />
              </div>

              {/* <button className="px-4 py-2 text-sm font-medium bg-white rounded-lg text-cyan-600">
                Blocked Users
              </button> */}
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-left text-[#71ABE0] uppercase">
                    S.ID
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-[#71ABE0] uppercase">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-[#71ABE0] uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-[#71ABE0] uppercase">
                    Joined Date
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-[#71ABE0] uppercase">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {String(startIndex + index + 1).padStart(2, "0")}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img src={user.avatar} className="w-8 h-8 rounded-full" />
                        <span className="ml-3 text-sm font-medium text-gray-900">
                          {user.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {user.email}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {user.joinedDate}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {/* UNBLOCK BUTTON */}
                        <button
                          onClick={() => handleBanUser(user)}
                          className="p-1 text-[#71ABE0] rounded-full hover:bg-red-50"
                        >
                          <VscDebugRestart className="w-4 h-4" />
                        </button>

                        {/* VIEW BUTTON */}
                        <button
                          onClick={() => handleViewUser(user)}
                          className="p-1 text-[#71ABE0] rounded-full hover:bg-blue-50"
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

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <span className="text-sm text-gray-700">
              SHOWING {startIndex + 1}-
              {Math.min(startIndex + usersPerPage, totalUsers)} OF {totalUsers}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 rounded-lg disabled:opacity-50 hover:bg-gray-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {renderPaginationNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() =>
                    typeof page === "number" && handlePageChange(page)
                  }
                  disabled={page === "..."}
                  className={`min-w-[32px] px-3 py-1 text-sm rounded-lg ${
                    page === currentPage
                      ? "bg-[#71ABE0] text-white"
                      : page === "..."
                      ? "text-gray-400 cursor-default"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 text-gray-400 rounded-lg disabled:opacity-50 hover:bg-gray-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW USER MODAL */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="flex-1 text-2xl font-semibold text-center text-[#71ABE0]">
                User Details
              </h2>

              <button onClick={handleCloseModal} className="ml-4 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-6">
                <img src={selectedUser.avatar} className="w-16 h-16 mr-4 rounded-full" />
                <h3 className="text-xl font-medium text-[#71ABE0]">
                  {selectedUser.name}
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Name</span>
                  <span>{selectedUser.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Email</span>
                  <span>{selectedUser.email}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Joined Date</span>
                  <span>{selectedUser.joinedDate}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 bg-white border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={() => handleBanUser(selectedUser)}
                className="flex-1 px-4 py-2 text-white bg-red-500 rounded-lg"
              >
                Block
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UNBLOCK CONFIRMATION MODAL */}
      {isConfirmModalOpen && userToBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="flex-1 text-2xl font-semibold text-center text-[#71ABE0]">
                Unblock User
              </h2>

              <button onClick={handleCancelBlock} className="ml-4 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-6">
                <img src={userToBlock.avatar} className="w-16 h-16 mr-4 rounded-full" />
                <h3 className="text-xl font-medium text-[#71ABE0]">
                  {userToBlock.name}
                </h3>
              </div>

               <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Name</span>
                  <span>{userToBlock.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Email</span>
                  <span>{userToBlock.email}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Joined Date</span>
                  <span>{userToBlock.joinedDate}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t">
              <button
                onClick={handleCancelBlock}
                className="flex-1 px-4 py-2 bg-white border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmBlock}
                className="flex-1 px-4 py-2 text-white bg-[#71ABE0] rounded-lg"
              >
                Yes, Unblock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockedList;
