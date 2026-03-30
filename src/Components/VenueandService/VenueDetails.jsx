import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Clock3,
  ImageOff,
  LoaderCircle,
  MapPin,
  Users,
  XCircle,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";
import useAuthStore from "../../store/useAuthStore";

const formatDate = (value, options = {}) => {
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
    ...options,
  });
};

const formatCurrency = (value, currency = "USD") => {
  if (value === null || value === undefined || value === "") {
    return "Not provided";
  }

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return String(value);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(numericValue);
};

const formatHour = (hour) => {
  if (hour === null || hour === undefined || hour === "") {
    return "Time unavailable";
  }

  const numericHour = Number(hour);

  if (Number.isNaN(numericHour)) {
    return String(hour);
  }

  const period = numericHour >= 12 ? "PM" : "AM";
  const displayHour = numericHour % 12 || 12;

  return `${displayHour}:00 ${period}`;
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

const normalizeVenueStatus = (status) => {
  if (status === "published") {
    return "approved";
  }

  if (status === "declined") {
    return "rejected";
  }

  return status || "pending";
};

const getStatusClasses = (status) => {
  switch (status) {
    case "approved":
      return "bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]";
    case "rejected":
    case "declined":
      return "bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]";
    case "changes":
    case "changes_required":
      return "bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE]";
    default:
      return "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]";
  }
};

const getSlotClasses = (status) => {
  switch (status) {
    case "booked":
      return "bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]";
    case "pending":
      return "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]";
    default:
      return "bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]";
  }
};

const getCalendarColor = (status) => {
  switch (status) {
    case "booked":
      return "bg-[#FF5A5A1A] text-gray-900";
    case "pending":
      return "bg-[#FACC151A] text-gray-900";
    default:
      return "bg-[#3CCF911A] text-gray-900";
  }
};

const getDayStatusFromSlots = (slots = []) => {
  const normalizedStatuses = slots.map((slot) => slot?.status);

  if (normalizedStatuses.includes("booked")) {
    return "booked";
  }

  if (normalizedStatuses.includes("pending")) {
    return "pending";
  }

  return "available";
};

const buildAvailabilityCalendar = (overrides = [], fallbackDateValue) => {
  const validOverrideDates = overrides
    .map((override) => new Date(override?.date))
    .filter((date) => !Number.isNaN(date.getTime()));

  const fallbackDate = new Date(fallbackDateValue || Date.now());
  const baseDate = validOverrideDates[0] || (Number.isNaN(fallbackDate.getTime()) ? new Date() : fallbackDate);
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const statusByDay = new Map();

  overrides.forEach((override) => {
    const overrideDate = new Date(override?.date);

    if (Number.isNaN(overrideDate.getTime())) {
      return;
    }

    if (overrideDate.getFullYear() !== year || overrideDate.getMonth() !== month) {
      return;
    }

    statusByDay.set(overrideDate.getDate(), getDayStatusFromSlots(override?.slots || []));
  });

  const cells = [];

  for (let index = 0; index < firstDayOfMonth; index += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= totalDaysInMonth; day += 1) {
    cells.push({
      day,
      status: statusByDay.get(day) || "available",
    });
  }

  return {
    monthLabel: baseDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
    cells,
  };
};

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const normalizeAmenities = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (item && typeof item === "object") {
          return item.name || item.label || item.title || "";
        }

        return "";
      })
      .filter(Boolean);
  }

  if (value && typeof value === "object") {
    return Object.entries(value)
      .filter(([, itemValue]) => Boolean(itemValue))
      .map(([key, itemValue]) => {
        if (typeof itemValue === "string") {
          return itemValue;
        }

        return key
          .replace(/([A-Z])/g, " $1")
          .replace(/[_-]/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .replace(/\b\w/g, (char) => char.toUpperCase());
      });
  }

  return [];
};

const normalizeImages = (media = {}) => {
  const imageCandidates = [
    media?.coverImage,
    media?.thumbnail,
    media?.featuredImage,
    ...(Array.isArray(media?.galleryImages) ? media.galleryImages : []),
    ...(Array.isArray(media?.images) ? media.images : []),
    ...(Array.isArray(media?.gallery) ? media.gallery : []),
    ...(Array.isArray(media?.photos) ? media.photos : []),
  ];

  return [...new Set(imageCandidates.filter((item) => typeof item === "string" && item.trim()))];
};

const getProviderName = (owner, information) =>
  owner?.fullName ||
  owner?.name ||
  information?.ownerName ||
  information?.providerName ||
  "Unknown Provider";

const getProviderEmail = (owner, information) =>
  owner?.email || information?.email || information?.providerEmail || "";

const getProviderPhone = (owner, information) =>
  owner?.phone || information?.phone || information?.providerPhone || "";

const VenueApproval = ({ entityType = "venue" }) => {
  const { id } = useParams();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isService = entityType === "service";
  const entityLabel = isService ? "Service" : "Venue";
  const entityLabelLower = entityLabel.toLowerCase();
  const entityEndpoint = isService ? "services" : "venues";

  const [venue, setVenue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [selectedDeclineReason, setSelectedDeclineReason] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [detailedMessage, setDetailedMessage] = useState("");
  const [requestChanges, setRequestChanges] = useState({
    images: false,
    pricing: false,
    capacity: false,
    address: false,
  });

  const fetchVenueDetails = async ({ showLoader = true } = {}) => {
    if (!id) {
      setError(`${entityLabel} id is missing.`);
      setIsLoading(false);
      return false;
    }

    if (!accessToken) {
      setError("You need to sign in first.");
      setIsLoading(false);
      return false;
    }

    if (showLoader) {
      setIsLoading(true);
    }

    setError(null);

    try {
      const requestUrl = `${API_BASE_URL}/api/v1/admin/${entityEndpoint}/${id}`;
      const bearerToken = `Bearer ${accessToken}`;

      console.log(`[fetch${entityLabel}Details] Request URL:`, requestUrl);
      console.log(`[fetch${entityLabel}Details] Authorization header:`, bearerToken);

      const response = await fetch(requestUrl, {
        headers: {
          Authorization: bearerToken,
        },
      });

      const result = await response.json();

      console.log(`[fetch${entityLabel}Details] Response status:`, response.status);
      console.log(`[fetch${entityLabel}Details] Response payload:`, result);

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || `Failed to load ${entityLabelLower} details.`);
      }

      setVenue(result?.data || null);
      return true;
    } catch (fetchError) {
      console.error(`[fetch${entityLabel}Details] Request failed:`, fetchError);
      setError(fetchError.message || `Failed to load ${entityLabelLower} details.`);
      return false;
    } finally {
      if (showLoader) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchVenueDetails();
  }, [accessToken, entityEndpoint, entityLabel, entityLabelLower, id]);

  const handleVenueAction = async (action) => {
    if (!id || !accessToken) {
      setActionError("You need to sign in first.");
      return;
    }

    const isRejectAction = action === "reject";

    if (isRejectAction && !selectedDeclineReason) {
      setActionSuccess("");
      setActionError("Please select a decline reason before rejecting.");
      return;
    }

    setActionError("");
    setActionSuccess("");

    if (action === "approve") {
      setIsApproving(true);
    } else {
      setIsRejecting(true);
    }

    try {
      const requestUrl = `${API_BASE_URL}/api/v1/admin/${entityEndpoint}/${id}/${action}`;
      const bearerToken = `Bearer ${accessToken}`;
      const payload = isRejectAction
        ? {
            reason: selectedDeclineReason,
            note: internalNote,
          }
        : undefined;

      console.log(`[${entityLabelLower}Action:${action}] Request URL:`, requestUrl);
      console.log(`[${entityLabelLower}Action:${action}] Authorization header:`, bearerToken);
      if (payload) {
        console.log(`[${entityLabelLower}Action:${action}] Request payload:`, payload);
      }

      const response = await fetch(requestUrl, {
        method: "PATCH",
        headers: {
          Authorization: bearerToken,
          "Content-Type": "application/json",
        },
        body: payload ? JSON.stringify(payload) : undefined,
      });

      const result = await response.json();

      console.log(`[${entityLabelLower}Action:${action}] Response status:`, response.status);
      console.log(`[${entityLabelLower}Action:${action}] Response payload:`, result);

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message ||
            (isRejectAction
              ? `Failed to reject ${entityLabelLower}.`
              : `Failed to approve ${entityLabelLower}.`)
        );
      }

      if (isRejectAction) {
        setSelectedDeclineReason("");
        setInternalNote("");
      }

      setActionSuccess(
        result?.message ||
          (isRejectAction
            ? `${entityLabel} rejected successfully.`
            : `${entityLabel} approved successfully.`)
      );

      await fetchVenueDetails({ showLoader: false });
    } catch (actionFetchError) {
      console.error(`[${entityLabelLower}Action:${action}] Request failed:`, actionFetchError);
      setActionError(
        actionFetchError.message ||
          (isRejectAction
            ? `Failed to reject ${entityLabelLower}.`
            : `Failed to approve ${entityLabelLower}.`)
      );
    } finally {
      if (action === "approve") {
        setIsApproving(false);
      } else {
        setIsRejecting(false);
      }
    }
  };

  const information = venue?.information || {};
  const pricing = venue?.pricing || {};
  const capacity = venue?.capacity || {};
  const settings = venue?.settings || {};
  const media = venue?.media || {};
  const owner =
    (venue?.ownerId && typeof venue.ownerId === "object" ? venue.ownerId : null) ||
    (venue?.owner && typeof venue.owner === "object" ? venue.owner : null) ||
    {};
  const providerBusiness =
    owner?.onboarding?.venueProvider ||
    owner?.provider?.venueProvider ||
    venue?.owner?.provider?.venueProvider ||
    {};

  const venueName = isService
    ? information?.serviceName || information?.name || information?.title || "Unnamed Service"
    : information?.venueName || information?.name || information?.title || "Unnamed Venue";
  const venueType = isService
    ? information?.serviceType ||
      information?.category ||
      settings?.category ||
      settings?.serviceMode ||
      "Type unavailable"
    : information?.venueType || information?.eventType || information?.category || "Type unavailable";
  const addressParts = [
    information?.addressLine,
    information?.area,
    information?.city,
    information?.address,
    information?.location,
    information?.fullAddress,
  ].filter(Boolean);
  const address = addressParts.length ? [...new Set(addressParts)].join(", ") : "Address not provided";
  const description = information?.description || "No description provided for this venue.";
  const providerName = getProviderName(owner, information);
  const providerEmail =
    getProviderEmail(owner, information) || providerBusiness?.businessMail || "No email provided";
  const providerPhone =
    getProviderPhone(owner, information) || providerBusiness?.businessPhoneNo || "No phone provided";
  const amenities = normalizeAmenities(
    pricing?.amenities || information?.amenities || information?.features || information?.services
  );
  const galleryImages = useMemo(() => normalizeImages(media), [media]);
  const availabilityOverrides = Array.isArray(venue?.availabilityOverrides)
    ? venue.availabilityOverrides
    : [];
  const availabilityCalendar = useMemo(
    () => buildAvailabilityCalendar(availabilityOverrides, venue?.createdAt),
    [availabilityOverrides, venue?.createdAt]
  );
  const priceCurrency = pricing?.currency || "USD";
  const normalizedPublishStatus = normalizeVenueStatus(venue?.publishStatus);

  const pricingHighlights = [
    {
      label: "Base price",
      value:
        pricing?.basePrice ??
        pricing?.pricePerPerson ??
        pricing?.perPerson ??
        pricing?.startingPrice ??
        pricing?.price,
    },
    {
      label: "Minimum capacity",
      value:
        capacity?.minimumGuests ??
        capacity?.min ??
        capacity?.minimum ??
        capacity?.minCapacity,
      formatter: (value) => (value ? `${value} guests` : "Not provided"),
    },
    {
      label: "Maximum capacity",
      value:
        capacity?.maximumGuests ??
        capacity?.max ??
        capacity?.maximum ??
        capacity?.maxCapacity,
      formatter: (value) => (value ? `${value} guests` : "Not provided"),
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen mt-[84px] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600 text-lg font-medium">
          <LoaderCircle className="w-6 h-6 animate-spin" />
          {`Loading ${entityLabelLower} details...`}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen mt-[84px]">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 text-center">
          <p className="text-xl font-semibold text-gray-900 mb-3">{`Unable to load ${entityLabelLower} details`}</p>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/venueandservice"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#B74140] text-white font-medium"
          >
            Back to venue list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-[84px]">
      <div>
        <div className="bg-[#B74140] rounded-t-2xl border border-[#E5E7EB] p-8 mb-0">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-white/80 text-sm uppercase tracking-[0.18em]">{`${entityLabel} Details`}</p>
              <h1 className="text-white text-4xl font-bold tracking-tight">{venueName}</h1>
            </div>
            <span
              className={`inline-flex items-center w-fit px-4 py-2 rounded-full border text-sm font-semibold capitalize ${getStatusClasses(
                normalizedPublishStatus
              )}`}
            >
              {normalizedPublishStatus}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-b-2xl border border-[#E5E7EB]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="border-2 border-[#E5E7EB] rounded-xl p-6 bg-gradient-to-br from-white to-gray-50">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{`${entityLabel} Overview`}</h2>

                <h3 className="text-2xl font-bold text-gray-900 mb-1">{venueName}</h3>
                <p className="text-gray-600 mb-4">{venueType}</p>

                <div className="flex items-start gap-2 text-gray-700 mb-4">
                  <MapPin className="w-5 h-5 text-[#B74140] mt-0.5 flex-shrink-0" />
                  <span>{address}</span>
                </div>

                <p className="text-gray-600 leading-7 mb-4">{description}</p>

                <div
                  className={`relative rounded-xl overflow-hidden border-2 border-[#E5E7EB] transition-all duration-500 ${
                    mapExpanded ? "h-96" : "h-56"
                  }`}
                >
                  {galleryImages[0] ? (
                    <>
                      <img
                        src={galleryImages[0]}
                        alt={venueName}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setMapExpanded(!mapExpanded)}
                      />
                      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                        <p className="text-sm font-semibold text-gray-700">
                          {mapExpanded ? "Click to collapse image" : "Click to expand image"}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-500">
                      <ImageOff className="w-10 h-10 mb-3" />
                      <p className="font-medium">No preview image available</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-2 border-[#E5E7EB] rounded-xl p-6 bg-gradient-to-br from-white to-gray-50">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {isService ? "Pricing & Settings" : "Pricing & Capacity"}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {pricingHighlights.map((item) => (
                    <div key={item.label}>
                      <p className="text-sm text-gray-600 mb-2">{item.label}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {item.formatter
                          ? item.formatter(item.value)
                          : formatCurrency(item.value, priceCurrency)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-2 border-[#E5E7EB] rounded-xl p-6 bg-gradient-to-br from-white to-gray-50">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Amenities</h2>

                {amenities.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#E5E7EB]"
                      >
                        <CheckCircle className="w-5 h-5 text-[#3CCF91] flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{amenity}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No amenities were provided for this venue.</p>
                )}
              </div>

              <div className="border-2 border-[#E5E7EB] rounded-xl p-6 bg-gradient-to-br from-white to-gray-50">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Gallery</h2>

                {galleryImages.length ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {galleryImages.map((img, index) => (
                      <div
                        key={`${img}-${index}`}
                        className="aspect-square rounded-xl overflow-hidden border-2 border-[#E5E7EB]"
                      >
                        <img
                          src={img}
                          alt={`${venueName} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No gallery images were uploaded for this venue.</p>
                )}
              </div>

              <div className="border-2 border-[#E5E7EB] rounded-xl p-6 bg-gradient-to-br from-white to-gray-50">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {isService ? "Service Provider Information" : "Venue Provider Information"}
                </h2>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#B74140] to-[#8B3130] flex items-center justify-center text-white text-2xl font-bold">
                    {getInitials(providerName)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{providerName}</h3>
                    <p className="text-gray-600">{providerEmail}</p>
                    <p className="text-gray-600">{providerPhone}</p>
                    {providerBusiness?.businessName ? (
                      <p className="text-gray-600">{providerBusiness.businessName}</p>
                    ) : null}
                    <span className="inline-block mt-2 px-3 py-1 bg-[#F3F4F6] text-gray-700 text-xs font-semibold rounded-full border border-[#E5E7EB]">
                      Owner ID: {venue?.ownerId?._id || venue?.owner?._id || venue?.ownerId || "Unavailable"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-2 border-[#E5E7EB] rounded-xl p-6 bg-gradient-to-br from-white to-gray-50">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Availability Overrides</h2>
                <p className="text-sm text-gray-500 mb-6">{availabilityCalendar.monthLabel}</p>

                {availabilityCalendar.cells.length ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-7 gap-2 mb-2">
                      {WEEKDAY_LABELS.map((day) => (
                        <div
                          key={day}
                          className="text-center text-sm font-medium text-gray-500 py-2"
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {availabilityCalendar.cells.map((cell, index) =>
                        cell ? (
                          <div
                            key={`${cell.day}-${index}`}
                            className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium ${getCalendarColor(
                              cell.status
                            )}`}
                          >
                            {cell.day}
                          </div>
                        ) : (
                          <div key={`empty-${index}`} className="aspect-square" />
                        )
                      )}
                    </div>

                    <div className="flex justify-center gap-6 mt-6 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-[#3CCF91]"></div>
                        <span className="text-sm text-gray-700 font-medium">Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-[#FF5A5A]"></div>
                        <span className="text-sm text-gray-700 font-medium">Booked</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-[#FACC15]"></div>
                        <span className="text-sm text-gray-700 font-medium">Pending Bookings</span>
                      </div>
                    </div>

                    {availabilityOverrides.length ? (
                      <div className="space-y-4 pt-4">
                        {availabilityOverrides.map((override, index) => (
                          <div
                            key={`${override?.date || "override"}-${index}`}
                            className="rounded-xl border border-[#E5E7EB] bg-white p-4"
                          >
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
                              <div className="flex items-center gap-2 text-gray-900 font-semibold">
                                <Clock3 className="w-4 h-4 text-[#B74140]" />
                                {formatDate(override?.date)}
                              </div>
                              <span className="text-sm text-gray-500">
                                {(override?.slots || []).length} slots
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {(override?.slots || []).map((slot, slotIndex) => (
                                <div
                                  key={`${override?.date || index}-${slot?.hour}-${slotIndex}`}
                                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border text-sm font-medium ${getSlotClasses(
                                    slot?.status
                                  )}`}
                                >
                                  <span>{formatHour(slot?.hour)}</span>
                                  <span className="capitalize">{slot?.status || "available"}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-gray-500">No availability overrides were provided.</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="border-2 border-[#E5E7EB] rounded-xl p-6 bg-gradient-to-br from-white to-gray-50">
                <h2 className="text-lg font-bold text-gray-900 mb-3">{`${entityLabel} Summary`}</h2>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-500">{`${entityLabel} ID`}</span>
                    <span className="text-gray-900 font-medium text-right break-all">
                      {venue?._id || "Unavailable"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-500">Currency</span>
                    <span className="text-gray-900 font-medium">{priceCurrency}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-500">Created</span>
                    <span className="text-gray-900 font-medium">
                      {formatDate(venue?.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-500">Updated</span>
                    <span className="text-gray-900 font-medium">
                      {formatDate(venue?.updatedAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-500">Approved at</span>
                    <span className="text-gray-900 font-medium">
                      {formatDate(venue?.approvedAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-500">Reviews</span>
                    <span className="text-gray-900 font-medium">
                      {Array.isArray(venue?.reviews) ? venue.reviews.length : 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-500">Deleted</span>
                    <span className="text-gray-900 font-medium">
                      {venue?.isDeleted ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>

              {(actionError || actionSuccess) && (
                <div
                  className={`border rounded-xl p-4 text-sm font-medium ${
                    actionError
                      ? "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]"
                      : "border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]"
                  }`}
                >
                  {actionError || actionSuccess}
                </div>
              )}

              <div className="border-2 border-[#E5E7EB] rounded-xl p-6 bg-gradient-to-br from-white to-gray-50">
                <h2 className="text-lg font-bold text-gray-900 mb-3">{`Approve ${entityLabel} Listing`}</h2>
                <p className="text-sm text-gray-600 mb-6">
                  {`Approving this ${entityLabelLower} will make it visible on the public landing page.`}
                </p>
                <button
                  type="button"
                  onClick={() => handleVenueAction("approve")}
                  disabled={isApproving || isRejecting}
                  className="w-full bg-[#3CCF91] hover:bg-[#2EB87E] disabled:bg-[#A7F3D0] disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  {isApproving ? "Approving..." : `Approve ${entityLabel}`}
                </button>
              </div>

              <div className="border-2 border-[#E5E7EB] rounded-xl p-6 bg-gradient-to-br from-white to-gray-50">
                <h2 className="text-lg font-bold text-gray-900 mb-3">{`Decline ${entityLabel} Listing`}</h2>
                <p className="text-sm text-gray-600 mb-6">
                  {`Decline this ${entityLabelLower} if it does not meet platform standards.`}
                </p>

                <select
                  className="w-full border-2 border-[#E5E7EB] rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-[#B74140] transition-colors duration-300"
                  value={selectedDeclineReason}
                  onChange={(event) => setSelectedDeclineReason(event.target.value)}
                >
                  <option value="">Select decline reason</option>
                  <option value="incomplete">Incomplete Information</option>
                  <option value="quality">Poor Quality Images</option>
                  <option value="pricing">Pricing Issues</option>
                  <option value="other">Other</option>
                </select>

                <textarea
                  className="w-full border-2 border-[#E5E7EB] rounded-lg px-4 py-3 mb-4 resize-none focus:outline-none focus:border-[#B74140] transition-colors duration-300"
                  rows="3"
                  placeholder="Optional internal note..."
                  value={internalNote}
                  onChange={(event) => setInternalNote(event.target.value)}
                />

                <button
                  type="button"
                  onClick={() => handleVenueAction("reject")}
                  disabled={isRejecting || isApproving}
                  className="w-full bg-[#FF5A5A] hover:bg-[#E64545] disabled:bg-[#FCA5A5] disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  {isRejecting ? "Rejecting..." : `Decline ${entityLabel}`}
                </button>
              </div>

              <div className="border-2 border-[#E5E7EB] rounded-xl p-6 bg-gradient-to-br from-white to-gray-50">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-[#2B7FFF]" />
                  Request Changes
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Ask the venue provider to update or correct specific information.
                </p>

                <div className="space-y-3 mb-4">
                  {[
                    { key: "images", label: "Missing or low-quality images" },
                    { key: "pricing", label: "Incorrect pricing" },
                    { key: "capacity", label: "Capacity mismatch" },
                    { key: "address", label: "Incomplete address" },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={requestChanges[item.key]}
                        onChange={(event) =>
                          setRequestChanges({
                            ...requestChanges,
                            [item.key]: event.target.checked,
                          })
                        }
                        className="w-5 h-5 text-[#2B7FFF] border-2 border-[#E5E7EB] rounded focus:ring-[#2B7FFF] cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>

                <textarea
                  className="w-full border-2 border-[#E5E7EB] rounded-lg px-4 py-3 mb-4 resize-none focus:outline-none focus:border-[#2B7FFF] transition-colors duration-300"
                  rows="4"
                  placeholder="Detailed message to provider..."
                  value={detailedMessage}
                  onChange={(event) => setDetailedMessage(event.target.value)}
                />

                <button className="w-full bg-[#2B7FFF] hover:bg-[#1E6FEE] text-white font-bold py-3.5 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Request Changes
                </button>
              </div>

              <div className="border-2 border-[#E5E7EB] rounded-xl p-6 bg-gradient-to-br from-white to-gray-50">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#B74140]" />
                  Provider Snapshot
                </h2>
                <p className="text-sm text-gray-600 mb-2">Provider</p>
                <p className="text-base font-semibold text-gray-900 mb-4">{providerName}</p>
                <p className="text-sm text-gray-600 mb-2">Contact</p>
                <p className="text-sm text-gray-900">{providerEmail}</p>
                <p className="text-sm text-gray-900">{providerPhone}</p>
                {providerBusiness?.businessName ? (
                  <>
                    <p className="text-sm text-gray-600 mt-4 mb-2">Business</p>
                    <p className="text-sm text-gray-900">{providerBusiness.businessName}</p>
                    <p className="text-sm text-gray-900">
                      {providerBusiness?.legalBusinessName || providerBusiness?.businessType || ""}
                    </p>
                    <p className="text-sm text-gray-900">
                      {providerBusiness?.businessMail || providerBusiness?.businessPhoneNo || ""}
                    </p>
                  </>
                ) : null}
                {media?.videoUrl ? (
                  <>
                    <p className="text-sm text-gray-600 mt-4 mb-2">Video URL</p>
                    <a
                      href={media.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-[#2B7FFF] break-all"
                    >
                      {media.videoUrl}
                    </a>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueApproval;
