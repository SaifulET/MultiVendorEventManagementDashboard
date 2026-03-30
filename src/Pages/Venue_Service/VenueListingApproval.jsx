import React, { useEffect, useMemo, useState } from "react";
import { Eye, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import useVenueStore from "../../store/useVenueStore";
import useServiceStore from "../../store/useServiceStore";

const formatDate = (value) => {
  if (!value) {
    return "Date unavailable";
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
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const normalizeVenueStatus = (status) => {
  if (status === "published") {
    return "approved";
  }

  if (status === "declined") {
    return "rejected";
  }

  return status || "pending";
};

const mapVenueRow = (venue) => {
  const information = venue?.information || {};
  const capacity = venue?.capacity || {};
  const owner = venue?.ownerId && typeof venue.ownerId === "object" ? venue.ownerId : {};

  const providerName =
    owner?.fullName ||
    owner?.name ||
    information?.ownerName ||
    information?.providerName ||
    "Unknown Provider";

  const email =
    owner?.email ||
    information?.email ||
    information?.providerEmail ||
    "No email provided";

  const time =
    information?.eventTime ||
    information?.time ||
    information?.bookingWindow ||
    "Time unavailable";

  const venueName =
    information?.venueName ||
    information?.name ||
    information?.title ||
    "Unnamed Venue";

  const eventType =
    information?.eventType ||
    information?.venueType ||
    information?.category ||
    (capacity?.min || capacity?.max
      ? `Capacity ${capacity?.min ?? 0}-${capacity?.max ?? 0}`
      : "Type unavailable");

  return {
    id: venue?._id,
    providerName,
    email,
    date: formatDate(
      information?.eventDate ||
        information?.availableDate ||
        venue?.createdAt ||
        venue?.updatedAt
    ),
    time,
    venueName,
    eventType,
    status: normalizeVenueStatus(venue?.publishStatus),
  };
};

const mapServiceRow = (service) => {
  const information = service?.information || {};
  const settings = service?.settings || {};
  const owner = service?.ownerId && typeof service.ownerId === "object" ? service.ownerId : {};

  const providerName =
    owner?.fullName ||
    owner?.name ||
    information?.ownerName ||
    information?.providerName ||
    "Unknown Provider";

  const email =
    owner?.email ||
    information?.email ||
    information?.providerEmail ||
    "No email provided";

  const time =
    information?.serviceTime ||
    information?.time ||
    settings?.bookingWindow ||
    "Time unavailable";

  const serviceName =
    information?.serviceName ||
    information?.name ||
    information?.title ||
    "Unnamed Service";

  const serviceType =
    information?.serviceType ||
    information?.category ||
    settings?.category ||
    settings?.serviceMode ||
    "Type unavailable";

  return {
    id: service?._id,
    providerName,
    email,
    date: formatDate(
      information?.serviceDate ||
        information?.availableDate ||
        service?.createdAt ||
        service?.updatedAt
    ),
    time,
    serviceName,
    serviceType,
    status: normalizeVenueStatus(service?.publishStatus),
  };
};

const getStatusConfig = (status) => {
  switch (status) {
    case "pending":
      return {
        bg: "bg-[#FEF9C3]",
        text: "text-[#854D0E]",
        icon: Clock,
        label: "Pending",
      };
    case "approved":
      return {
        bg: "bg-[#DCFCE7]",
        text: "text-[#166534]",
        icon: CheckCircle,
        label: "Approved",
      };
    case "rejected":
    case "declined":
      return {
        bg: "bg-[#FEE2E2]",
        text: "text-[#991B1B]",
        icon: AlertTriangle,
        label: "Rejected",
      };
    case "changes":
    case "changes_required":
      return {
        bg: "bg-[#DBEAFE]",
        text: "text-[#1E40AF]",
        icon: AlertTriangle,
        label: "Changes Required",
      };
    default:
      return {
        bg: "bg-[#FEF9C3]",
        text: "text-[#854D0E]",
        icon: Clock,
        label: "Pending",
      };
  }
};

const VenueListingApproval = () => {
  const [activeTab, setActiveTab] = useState("venue");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const venues = useVenueStore((state) => state.venues);
  const venueMeta = useVenueStore((state) => state.meta);
  const isVenueLoading = useVenueStore((state) => state.isLoading);
  const venueError = useVenueStore((state) => state.error);
  const fetchVenues = useVenueStore((state) => state.fetchVenues);
  const services = useServiceStore((state) => state.services);
  const serviceMeta = useServiceStore((state) => state.meta);
  const isServiceLoading = useServiceStore((state) => state.isLoading);
  const serviceError = useServiceStore((state) => state.error);
  const fetchServices = useServiceStore((state) => state.fetchServices);

  useEffect(() => {
    if (activeTab === "venue") {
      fetchVenues({ page: currentPage , limit: itemsPerPage });
      return;
    }

    fetchServices({ page: currentPage, limit: itemsPerPage });
  }, [activeTab, currentPage, fetchServices, fetchVenues]);

  const mappedVenueData = useMemo(() => venues.map(mapVenueRow), [venues]);
  const mappedServiceData = useMemo(() => services.map(mapServiceRow), [services]);
  const currentMeta = activeTab === "venue" ? venueMeta : serviceMeta;
  const isLoading = activeTab === "venue" ? isVenueLoading : isServiceLoading;
  const error = activeTab === "venue" ? venueError : serviceError;

  const currentData = activeTab === "venue" ? mappedVenueData : mappedServiceData;
  const totalPages =
    Math.max(currentMeta?.totalPages || 1, 1);
  const startIndex =
    (currentMeta?.page || 0) * (currentMeta?.limit || itemsPerPage);
  const endIndex =
    startIndex + currentData.length;
  const displayData = currentData;

  const generatePageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i += 1) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(currentPage + 1, totalPages - 1);
        i += 1
      ) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const totalItems = currentMeta?.total || 0;

  return (
    <div className="min-h-screen mt-[96px] ">
      <div className="">
        <div className="bg-[#B74140] px-[20px] py-[18px] rounded-t-xl">
          <h1 className="text-white text-3xl font-semibold">
            Venue & Service listing approval
          </h1>
        </div>

        <div className="bg-gray-50 pt-6 pb-0 flex gap-3">
          <button
            onClick={() => handleTabChange("venue")}
            className={`px-6 py-3 rounded-lg font-medium text-[15px] transition-all ${
              activeTab === "venue"
                ? "bg-[#B74140] text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            Venue
          </button>
          <button
            onClick={() => handleTabChange("service")}
            className={`px-6 py-3 rounded-lg font-medium text-[15px] transition-all ${
              activeTab === "service"
                ? "bg-[#B74140] text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            Service
          </button>
        </div>

        <div className="mt-[16px] ">
          <div className="rounded-lg border border-[#E5E7EB] overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border border-[#E5E7EB]">
                <tr className="border-b border-gray-200">
                  <th className="text-left px-4 py-4 text-gray-600 font-semibold text-sm">
                    {activeTab === "venue" ? "Venue Provider Name" : "Service Provider Name"}
                  </th>
                  <th className="text-left px-4 py-4 text-gray-600 font-semibold text-sm">
                    Date
                  </th>
                  <th className="text-left px-4 py-4 text-gray-600 font-semibold text-sm">
                    {activeTab === "venue" ? "Venue Name" : "Service Name"}
                  </th>
                  <th className="text-left px-4 py-4 text-gray-600 font-semibold text-sm">
                    Status
                  </th>
                  <th className="text-left px-4 py-4 text-gray-600 font-semibold text-sm">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {isLoading && (
                  <tr>
                    <td colSpan="5" className="px-4 py-10 text-center text-gray-500">
                      {activeTab === "venue" ? "Loading venues..." : "Loading services..."}
                    </td>
                  </tr>
                )}

                {!isLoading && error && (
                  <tr>
                    <td colSpan="5" className="px-4 py-10 text-center text-red-500">
                      {error}
                    </td>
                  </tr>
                )}

                {!isLoading && !error && displayData.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-4 py-10 text-center text-gray-500">
                      {activeTab === "venue" ? "No venues found." : "No services found."}
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  !error &&
                  displayData.map((item) => {
                    const statusConfig = getStatusConfig(item.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <tr
                        key={item.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                              {getInitials(item.providerName)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 text-[15px]">
                                {item.providerName}
                              </div>
                              <div className="text-gray-500 text-[13px] mt-0.5">
                                {item.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-5">
                          <div className="font-medium text-gray-900 text-[15px]">
                            {item.date}
                          </div>
                          <div className="text-gray-500 text-[13px] mt-1">
                            {item.time}
                          </div>
                        </td>
                        <td className="px-4 py-5">
                          <div className="font-medium text-gray-900 text-[15px]">
                            {activeTab === "venue" ? item.venueName : item.serviceName}
                          </div>
                          <div className="text-gray-500 text-[13px] mt-1">
                            {activeTab === "venue" ? item.eventType : item.serviceType}
                          </div>
                        </td>
                        <td className="px-4 py-5">
                          <div
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md ${statusConfig.bg} ${statusConfig.text} text-[13px] font-medium`}
                          >
                            <StatusIcon size={14} />
                            {statusConfig.label}
                          </div>
                        </td>
                        <td className="px-4 py-5">
                          <Link
                            to={
                              activeTab === "venue"
                                ? `/venueandservice/venuedetails/${item.id}`
                                : `/venueandservice/servicedetails/${item.id}`
                            }
                          >
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-all">
                              <Eye size={16} />
                              View Details
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 px-2">
            <div className="text-[#B74140] text-sm font-medium uppercase">
              SHOWING {displayData.length ? startIndex + 1 : 0}-
              {Math.min(endIndex, totalItems)} OF {totalItems}
            </div>

            <div className="flex gap-2 items-center flex-wrap justify-center">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || isLoading}
                className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-md bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-all text-lg"
              >
                {"<"}
              </button>

              {generatePageNumbers().map((page, index) =>
                page === "..." ? (
                  <span key={`ellipsis-${index}`} className="px-2 text-gray-500 text-sm">
                    ....
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`min-w-[36px] h-9 px-3 rounded-md text-sm font-medium transition-all ${
                      currentPage === page
                        ? "bg-[#B74140] text-white border border-[#B74140]"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages || isLoading}
                className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-md bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-all text-lg"
              >
                {">"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueListingApproval;
