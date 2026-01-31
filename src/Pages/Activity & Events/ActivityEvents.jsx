import { useState } from "react";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  MapPin,
  Users,
  Tag,
  Info,
  Check,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

const ActivityEvents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const activityTitles = ["Yoga", "Morning Walk", "Walking", "Running", "Cycling", "Meditation"];
  const activityTypes = ["Active", "Event"];
  const hosts = [
    "John Carter",
    "Sophia Adams",
    "Liam Wilson",
    "Emma Johnson",
    "Noah Walker",
    "Olivia Brown",
    "Mason Davis",
    "Ava Martinez",
  ];
  const statusTypes = ["Ongoing", "Completed", "Upcoming"];

  const events = Array.from({ length: 20 }, (_, i) => {
    const title = activityTitles[Math.floor(Math.random() * activityTitles.length)];
    const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const host = hosts[Math.floor(Math.random() * hosts.length)];
    const status = statusTypes[Math.floor(Math.random() * statusTypes.length)];

    return {
      id: i + 1,
      title,
      type,
      host,
      status,
      image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000",
    };
  });

  const usersPerPage = 8;
  const totalPages = Math.ceil(events.length / usersPerPage);

  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = events.slice(startIndex, startIndex + usersPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
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
      pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push("...");
    if (!pages.includes(totalPages)) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div style={{ boxShadow: "0px 1px 6px rgba(0,0,0,0.24)" }} className="mx-auto mt-16">
        
        {/* Header */}
        <div className="px-6 py-4 mb-6 rounded-tl-lg rounded-tr-lg bg-[#71ABE0]">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">Activities & Events Management</h1>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  placeholder="Search Events"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 py-2 pl-10 pr-4 text-sm bg-white rounded-lg focus:ring-2 focus:ring-cyan-300"
                />
              </div>


            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-left text-[#71ABE0] uppercase">S.ID</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-[#71ABE0] uppercase">Title</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-[#71ABE0] uppercase">Type</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-[#71ABE0] uppercase">Host</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-[#71ABE0] uppercase">Status</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-[#71ABE0] uppercase">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {currentUsers.map((ev, index) => (
                  <tr key={ev.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{String(startIndex + index + 1).padStart(2, "0")}</td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{ev.title}</td>

                    <td className="px-6 py-4 text-sm text-gray-900">{ev.type}</td>

                    {/* HOST WITH IMAGE */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img src={ev.image} className="w-8 h-8 rounded-full" />
                        <span className="ml-3 text-sm text-gray-900">{ev.host}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">{ev.status}</td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewUser(ev)}
                        className="p-1 text-[#71ABE0] hover:bg-blue-50 rounded-full"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <span className="text-sm text-gray-700">
              SHOWING {startIndex + 1}-{Math.min(startIndex + usersPerPage, events.length)} OF {events.length}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {renderPaginationNumbers().map((page, idx) => (
                <button
                  key={idx}
                  onClick={() => typeof page === "number" && handlePageChange(page)}
                  className={`min-w-[32px] px-3 py-1 text-sm rounded-lg ${
                    page === currentPage ? "bg-[#71ABE0] text-white" : "hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-400 disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-blue-400">Manage Activity</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 transition-colors hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              
              {/* Activity Card */}
              <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
                <div className="flex flex-col gap-4 p-5 sm:flex-row">

                  {/* Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={selectedUser.image}
                      alt="Activity"
                      className="object-cover w-full h-32 rounded-lg sm:w-32"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900">{selectedUser.title}</h3>

                    <div className="flex items-center gap-2">
                      <img src={selectedUser.image} className="w-8 h-8 rounded-full" />
                      <span className="font-medium text-gray-700">{selectedUser.host}</span>
                    </div>

                    <p className="text-sm leading-relaxed text-gray-600">
                      This activity is auto-generated sample content for UI preview only.
                      Replace with your API data later.
                    </p>

                    <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">

                      <div>
                        <div className="mb-1 text-xs font-medium text-gray-500">Date & Time:</div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={16} className="text-gray-400" />
                          <span className="font-medium text-gray-900">Saturday, Dec 14, 2024</span>
                        </div>
                      </div>

                      <div>
                        <div className="mb-1 text-xs font-medium text-gray-500">Location:</div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin size={16} className="text-gray-400" />
                          <span className="font-medium text-gray-900">City Park, NY</span>
                        </div>
                      </div>

                      <div>
                        <div className="mb-1 text-xs font-medium text-gray-500">Participants Limit:</div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users size={16} className="text-gray-400" />
                          <span className="font-medium text-gray-900">15 people</span>
                        </div>
                      </div>

                      <div>
                        <div className="mb-1 text-xs font-medium text-gray-500">Category:</div>
                        <div className="flex items-center gap-2 text-sm">
                          <Tag size={16} className="text-gray-400" />
                          <span className="px-3 py-1 text-xs font-medium text-blue-600 rounded-full bg-blue-50">
                            Fitness
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              {/* Info Banner */}
              <div className="flex items-start gap-3 p-4 mt-6 border border-blue-200 rounded-lg bg-blue-50">
                <Info size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">Only approved activities appear in the app.</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-6 sm:flex-row">
                <button className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-medium text-white transition-colors bg-blue-400 rounded-lg hover:bg-blue-500">
                  <Check size={20} />
                  Approve Activity
                </button>

                <button className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-medium text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600">
                  <Trash2 size={20} />
                  Delete Activity
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityEvents;
