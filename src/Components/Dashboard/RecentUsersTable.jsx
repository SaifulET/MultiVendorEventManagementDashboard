import { useEffect, useState } from "react";
import { Ban, Eye, X } from "lucide-react";
import useAdminAnalyticsStore from "../../store/useAdminAnalyticsStore";
import useAdminUserStore from "../../store/useAdminUserStore";

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

const RecentUsersTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToBlock, setUserToBlock] = useState(null);
  const [actionError, setActionError] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);

  const recentUsers = useAdminAnalyticsStore((state) => state.recentUsers);
  const isLoading = useAdminAnalyticsStore((state) => state.isRecentUsersLoading);
  const error = useAdminAnalyticsStore((state) => state.recentUsersError);
  const fetchRecentUsers = useAdminAnalyticsStore((state) => state.fetchRecentUsers);
  const updateUserStatus = useAdminUserStore((state) => state.updateUserStatus);

  useEffect(() => {
    fetchRecentUsers();
  }, [fetchRecentUsers]);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleBanUser = (user) => {
    setActionError("");
    setUserToBlock(user);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmBlock = async () => {
    if (!userToBlock?.id || !userToBlock?.userType) {
      setActionError("This user role is not supported for blocking.");
      return;
    }

    setActionError("");
    setIsActionLoading(true);

    try {
      await updateUserStatus({
        userType: userToBlock.userType,
        userId: userToBlock.id,
        action: "block",
      });

      setIsConfirmModalOpen(false);
      setUserToBlock(null);
      handleCloseModal();
      await fetchRecentUsers();
    } catch (statusError) {
      setActionError(statusError.message || "Failed to block user.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCancelBlock = () => {
    setIsConfirmModalOpen(false);
    setUserToBlock(null);
    setActionError("");
  };

  return (
    <div className=" my-[30px] bg-gray-50">
      <div className="rounded border border-1 border-gray-200">
        <div className="px-6 py-4 mb-6 rounded-tl-lg rounded-tr-lg">
          <h1 className="text-2xl font-semibold">Recent Users</h1>
        </div>

        <div className="bg-white rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#B74140]">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                    S.ID
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                    Joined Date
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading && (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                      Loading recent users...
                    </td>
                  </tr>
                )}

                {!isLoading && error && (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-red-500">
                      {error}
                    </td>
                  </tr>
                )}

                {!isLoading && !error && recentUsers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                      No recent users found.
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  !error &&
                  recentUsers.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {String(index + 1).padStart(2, "0")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="object-cover w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[#F3D7D7] text-[#B74140] flex items-center justify-center text-xs font-semibold">
                              {getInitials(user.name)}
                            </div>
                          )}
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
                            onClick={() => handleBanUser(user)}
                            disabled={!user.userType || user.isBlocked}
                            className="p-1 text-red-500 rounded-full hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Ban className="w-4 h-4" />
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
        </div>
      </div>

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="flex-1 text-2xl font-semibold text-center text-[#B74140]">
                User Details
              </h2>
              <button onClick={handleCloseModal} className="ml-4 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-6">
                {selectedUser.avatar ? (
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="object-cover w-16 h-16 mr-4 rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 mr-4 rounded-full bg-[#F3D7D7] text-[#B74140] flex items-center justify-center text-xl font-semibold">
                    {getInitials(selectedUser.name)}
                  </div>
                )}
                <h3 className="text-xl font-medium text-[#B74140]">{selectedUser.name}</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between gap-4">
                  <span className="font-medium text-gray-700">Name</span>
                  <span className="text-right text-gray-900 break-all">{selectedUser.name}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="font-medium text-gray-700">Email</span>
                  <span className="text-right text-gray-900 break-all">{selectedUser.email}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="font-medium text-gray-700">Joining Date</span>
                  <span className="text-right text-gray-900">{selectedUser.joinedDate}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="font-medium text-gray-700">Role</span>
                  <span className="text-right text-gray-900">{selectedUser.roleLabel}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="font-medium text-gray-700">Account Status</span>
                  <span className="text-right text-gray-900">
                    {selectedUser.isBlocked ? "Blocked" : "Active"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 text-sm font-medium bg-white border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={() => handleBanUser(selectedUser)}
                disabled={!selectedUser.userType || selectedUser.isBlocked}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                Block
              </button>
            </div>
          </div>
        </div>
      )}

      {isConfirmModalOpen && userToBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-sm p-6 mx-4 text-center bg-white rounded-lg shadow-xl">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Do you want to block this user?
            </h2>

            <p className="mb-4 text-sm text-gray-600">{userToBlock.name}</p>
            {actionError && <p className="mb-4 text-sm text-red-500">{actionError}</p>}

            <div className="flex gap-3">
              <button
                onClick={handleCancelBlock}
                disabled={isActionLoading}
                className="flex-1 px-4 py-2 text-sm bg-white border rounded-lg disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmBlock}
                disabled={isActionLoading}
                className="flex-1 px-4 py-2 text-sm text-white bg-[#B74140] rounded-lg disabled:opacity-50"
              >
                {isActionLoading ? "Blocking..." : "Yes, Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentUsersTable;
