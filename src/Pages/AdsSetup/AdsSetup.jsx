import { useState } from "react";
import { Edit } from "lucide-react";
import { MdDelete } from "react-icons/md";
import { CiPower } from "react-icons/ci";

const usersData = [
  {
    id: "01",
    addName: "Homepage Banner",
    status: "Active",
  },
  {
    id: "02",
    addName: "Sidebar Promotion",
    status: "Inactive",
  },
  {
    id: "03",
    addName: "Video Ad Intro",
    status: "Active",
  },
  {
    id: "04",
    addName: "Footer Sponsor Ad",
    status: "Inactive",
  },
  {
    id: "05",
    addName: "Slider Promo",
    status: "Active",
  },
];

const AdsSetup = () => {
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [adLink, setAdLink] = useState("");
  const [isActive, setIsActive] = useState(false);

  const handleEdit = (user) => {
    setEditingUser(user);
    setAdLink(user.addName);
    setIsActive(user.status === "Active");
  };

  const handleDelete = (user) => setDeletingUser(user);

  const handleCreate = () => {
    setIsCreating(true);
    setAdLink("");
    setIsActive(false);
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setAdLink("");
    setIsActive(false);
  };

  const closeDeleteModal = () => setDeletingUser(null);

  const closeCreateModal = () => {
    setIsCreating(false);
    setAdLink("");
    setIsActive(false);
  };

  const handleConfirmDelete = () => {
    console.log("Deleted:", deletingUser);
    setDeletingUser(null);
  };

  const handleSave = () => {
    const adData = {
      addName: adLink,
      status: isActive ? "Active" : "Inactive",
    };

    if (isCreating) {
      console.log("Creating new ad:", adData);
      closeCreateModal();
    } else {
      console.log("Saving edit:", { ...editingUser, ...adData });
      closeEditModal();
    }
  };

  return (
    <div className="w-full px-4 mx-auto mt-20">
      <div className="overflow-hidden bg-white rounded-md shadow-sm">
        <div className="bg-[#71ABE0] py-5 rounded-tl-md rounded-tr-md flex justify-between px-5 items-center">
          <h2 className="px-4 text-2xl font-semibold text-white">
            Add Management
          </h2>
          <button
            onClick={handleCreate}
            className="text-[#71ABE0] bg-white font-bold py-3 px-8 rounded-md hover:bg-gray-100 transition-colors"
          >
            Create New Add
          </button>
        </div>

        <div
          style={{ boxShadow: "0px 1px 6px 0px rgba(0, 0, 0, 0.24)" }}
          className="overflow-x-auto rounded-lg"
        >
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 text-sm font-medium text-left">
                  S ID
                </th>
                <th className="px-6 py-3 text-sm font-medium text-left">
                  Add Name
                </th>
                <th className="px-6 py-3 text-sm font-medium text-left">
                  Status
                </th>
                <th className="px-6 py-3 text-sm font-medium text-left">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {usersData.map((user, index) => (
                <tr
                  key={user.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-3 text-sm text-gray-900">{user.id}</td>

                  <td className="px-6 py-3 text-sm text-gray-900">
                    {user.addName}
                  </td>

                  <td className="px-6 py-3 text-sm text-gray-900">
                    {user.status}
                  </td>

                  <td className="px-6 py-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 transition-colors bg-blue-100 rounded-full hover:bg-blue-200"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>

                      <button
                        onClick={() => handleDelete(user)}
                        className="p-2 transition-colors bg-red-100 rounded-full hover:bg-red-200"
                        title="Delete"
                      >
                        <MdDelete className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/*===================================== Create/Edit Modal =====================================*/}
      {(isCreating || editingUser) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black bg-opacity-40">
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
            <h3 className="mb-6 text-2xl font-medium text-center text-[#71ABE0]">
              {isCreating ? "Create New Ad" : "Edit Ad"}
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Ad Link
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={adLink}
                    onChange={(e) => setAdLink(e.target.value)}
                    placeholder="https://example.com/your-landing-page"
                    className="w-full px-10 py-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <svg
                    className="absolute w-5 h-5 text-gray-400 left-3 top-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Enter the URL where users will be redirected when clicking the
                  ad
                </p>
              </div>

              <div>
                <label className="block mb-3 text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full">
                      <CiPower />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Activate Now?
                      </p>
                      <p className="text-xs text-gray-500">
                        Turn on to make ad live immediately
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#71ABE0]"></div>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={isCreating ? closeCreateModal : closeEditModal}
                  className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 transition-colors bg-white border border-[#71ABE0] rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-3 text-sm font-medium text-white bg-[#71ABE0] rounded-md hover:bg-[#5a94c9] transition-colors"
                >
                  {isCreating ? "Save Ad" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/*========================================= Delete Modal =========================================*/}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black bg-opacity-40">
          <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
            <h3 className="mb-4 text-2xl font-bold text-center">
              Do you want to delete this Ad?
            </h3>

            <div className="flex justify-center gap-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 text-sm  transition-colors bg-white border border-[#71ABE0] text-[#71ABE0]  rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm text-white transition-colors bg-red-600 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdsSetup;
